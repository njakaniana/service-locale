const db = require("../config/db");
const { ensureWalletForUser, query } = require("../config/init-db");
const bcrypt = require("bcryptjs");
const ADMIN_COMMISSION_RATE = 0.20;

const getAdminUserId = async () => {
  let admin = await query("SELECT id FROM users WHERE LOWER(role) = 'admin' ORDER BY id ASC LIMIT 1");

  if (!admin.length) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    await query(
      `INSERT INTO users (nom, prenom, email, telephone, mot_de_passe, role)
       VALUES ('Admin', 'Service Mada', 'admin@gmail.com', '0340000000', ?, 'admin')
       ON DUPLICATE KEY UPDATE role = 'admin'`,
      [adminPassword]
    );
    admin = await query("SELECT id FROM users WHERE LOWER(role) = 'admin' ORDER BY id ASC LIMIT 1");
  }

  return admin[0]?.id || null;
};

const createWalletTransaction = async ({
  userId,
  walletId,
  paymentId,
  type,
  montant,
  description,
  soldeApres
}) => {
  await query(
    `
      INSERT INTO wallet_transactions
      (user_id, wallet_id, payment_id, type, montant, description, solde_apres)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, walletId, paymentId, type, montant, description, soldeApres]
  );
};

const payService = async (req, res) => {
  try {
    const { client_id, prestataire_id, service_id, montant, description } = req.body;

    if (!client_id || !prestataire_id || !service_id || !montant) {
      return res.status(400).json({ message: "client_id, prestataire_id, service_id et montant sont obligatoires" });
    }

    const montantNet = Number(montant);
    if (!Number.isFinite(montantNet) || montantNet <= 0) {
      return res.status(400).json({ message: "Le montant du service doit être supérieur à 0" });
    }

    const adminId = await getAdminUserId();
    if (!adminId) return res.status(500).json({ message: "Impossible de créer le compte admin" });

    const clientRows = await query(
      "SELECT prenom, nom, email, telephone FROM users WHERE id = ? LIMIT 1",
      [client_id]
    );

    if (!clientRows.length) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    const client = clientRows[0];
    const clientName = `${client.prenom || ""} ${client.nom || ""}`.trim() || "Client";

    const serviceRows = await query(
      `SELECT s.id, s.prix, s.nom, s.prestataire_id AS prestataire_record_id, p.user_id AS prestataire_user_id
       FROM services s
       JOIN prestataires p ON p.id = s.prestataire_id
       WHERE s.id = ? AND s.disponible = 1 LIMIT 1`,
      [service_id]
    );
    if (!serviceRows.length) return res.status(404).json({ message: "Service introuvable" });

    const service = serviceRows[0];
    const providerUserId = Number(service.prestataire_user_id);
    const providerRecordId = Number(service.prestataire_record_id);

    if (providerUserId !== Number(prestataire_id)) {
      return res.status(400).json({ message: "Le prestataire ne correspond pas au service sélectionné" });
    }

    const prixService = Number(service.prix);
    if (Math.abs(prixService - montantNet) > 0.01) {
      return res.status(400).json({ message: "Le montant ne correspond pas au prix du service" });
    }

    const commissionAdmin = Number((prixService * ADMIN_COMMISSION_RATE).toFixed(2));
    const montantPrestataire = Number((prixService - commissionAdmin).toFixed(2));

    const clientWallet = await ensureWalletForUser(client_id);
    const providerWallet = await ensureWalletForUser(providerUserId);
    const adminWallet = await ensureWalletForUser(adminId);

    if (Number(clientWallet.solde) < montantNet) {
      return res.status(400).json({ message: "Solde insuffisant dans le portefeuille du client" });
    }

    await query("START TRANSACTION");
    try {
      const paymentResult = await query(
        `INSERT INTO payments
         (client_id, prestataire_id, admin_id, service_id, montant, commission_admin, montant_prestataire, status, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'payé', ?)`,
        [client_id, providerUserId, adminId, service_id, montantNet, commissionAdmin, montantPrestataire, description || `Paiement : ${service.nom}`]
      );
      const paymentId = paymentResult.insertId;

      const requestResult = await query(
        `INSERT INTO service_requests (client_id, prestataire_id, service_id, prix, statut, description)
         VALUES (?, ?, ?, ?, 'en_attente', ?)`,
        [client_id, providerRecordId, service_id, montantNet, description || "Demande de service"]
      );

      await query("UPDATE wallets SET solde = solde - ? WHERE user_id = ?", [montantNet, client_id]);
      const clientAfter = Number(Number(clientWallet.solde - montantNet).toFixed(2));
      await createWalletTransaction({ userId: client_id, walletId: clientWallet.id, paymentId, type: "debit", montant: montantNet, description: "Paiement du service", soldeApres: clientAfter });

      await query("UPDATE wallets SET solde = solde + ? WHERE user_id = ?", [commissionAdmin, adminId]);
      const adminAfter = Number(Number(adminWallet.solde + commissionAdmin).toFixed(2));
      await createWalletTransaction({ userId: adminId, walletId: adminWallet.id, paymentId, type: "credit", montant: commissionAdmin, description: "Commission admin (20%)", soldeApres: adminAfter });

      await query("UPDATE wallets SET solde = solde + ? WHERE user_id = ?", [montantPrestataire, providerUserId]);
      const providerAfter = Number(Number(providerWallet.solde + montantPrestataire).toFixed(2));
      await createWalletTransaction({ userId: providerUserId, walletId: providerWallet.id, paymentId, type: "credit", montant: montantPrestataire, description: "Versement prestataire (80%)", soldeApres: providerAfter });

      await query(`INSERT INTO notifications (user_id, titre, message, type, lu) VALUES (?, ?, ?, 'payment', 0)`, [client_id, "Paiement réussi", `Votre paiement de ${montantNet.toLocaleString("fr-FR")} Ar a été enregistré.`]);
      await query(
        `INSERT INTO notifications (user_id, titre, message, type, lu) VALUES (?, ?, ?, 'service', 0)`,
        [
          providerUserId,
          "Nouvelle demande de service",
          `Client : ${clientName}. Email : ${client.email || "Non renseigné"}. Téléphone : ${client.telephone || "Non renseigné"}. Service : ${service.nom}.`
        ]
      );

      await query("COMMIT");

      return res.status(201).json({
        message: "Paiement validé avec répartition automatique",
        data: { payment_id: paymentId, demande_id: requestResult.insertId, montant_total: montantNet, commission_admin: commissionAdmin, montant_prestataire: montantPrestataire, client_id, prestataire_id: providerUserId, prestataire_record_id: providerRecordId, admin_id: adminId, service_id }
      });
    } catch (transactionError) {
      await query("ROLLBACK");
      throw transactionError;
    }
  } catch (error) {
    console.error("Erreur paiement service :", error);
    return res.status(500).json({ message: "Erreur lors du paiement du service", error: error.message });
  }
};

const depositWallet = async (req, res) => {
  try {
    const { user_id, montant } = req.body;
    const amount = Number(montant);
    if (!user_id || !Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Utilisateur et montant positif obligatoires" });
    const wallet = await ensureWalletForUser(user_id);
    await query("START TRANSACTION");
    try {
      await query("UPDATE wallets SET solde = solde + ? WHERE user_id = ?", [amount, user_id]);
      const after = Number(Number(wallet.solde + amount).toFixed(2));
      await createWalletTransaction({ userId: user_id, walletId: wallet.id, paymentId: null, type: "credit", montant: amount, description: "Recharge du portefeuille", soldeApres: after });
      await query("COMMIT");
      return res.status(201).json({ message: "Portefeuille rechargé", wallet: { ...wallet, solde: after } });
    } catch (e) { await query("ROLLBACK"); throw e; }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la recharge" });
  }
};

const withdrawWallet = async (req, res) => {
  try {
    const { user_id, montant } = req.body;
    const amount = Number(montant);
    if (!user_id || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Utilisateur et montant positif obligatoires" });
    }

    const wallet = await ensureWalletForUser(user_id);
    if (Number(wallet.solde) < amount) {
      return res.status(400).json({ message: "Solde insuffisant pour effectuer le retrait" });
    }

    await query("START TRANSACTION");
    try {
      await query("UPDATE wallets SET solde = solde - ? WHERE user_id = ?", [amount, user_id]);
      const after = Number(Number(wallet.solde - amount).toFixed(2));
      await createWalletTransaction({ userId: user_id, walletId: wallet.id, paymentId: null, type: "debit", montant: amount, description: "Retrait du portefeuille", soldeApres: after });
      await query("COMMIT");
      return res.status(200).json({ message: "Retrait effectué", wallet: { ...wallet, solde: after } });
    } catch (e) {
      await query("ROLLBACK");
      throw e;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors du retrait" });
  }
};

const getWalletByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const wallets = await query("SELECT * FROM wallets WHERE user_id = ? LIMIT 1", [userId]);

    if (!wallets.length) {
      return res.status(404).json({ message: "Portefeuille introuvable" });
    }

    return res.json({ wallet: wallets[0] });
  } catch (error) {
    console.error("Erreur récupération portefeuille :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await query(
      `
        SELECT *
        FROM wallet_transactions
        WHERE user_id = ?
        ORDER BY date_creation DESC
      `,
      [userId]
    );

    return res.json({ transactions });
  } catch (error) {
    console.error("Erreur historique transactions :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  payService,
  getWalletByUser,
  getTransactionsByUser,
  depositWallet,
  withdrawWallet
};
