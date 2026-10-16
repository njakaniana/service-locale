const express = require("express");
const { ensureWalletForUser, query } = require("../config/init-db");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [[users], [providers], [services], [payments], [validatedRequests], [allRequests], [activeClients], monthlyPayments] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM users"),
      query("SELECT COUNT(*) AS total FROM prestataires WHERE validation_status = 'accepted'"),
      query("SELECT COUNT(*) AS total FROM services"),
      query("SELECT COUNT(*) AS total, COALESCE(SUM(commission_admin), 0) AS commission FROM payments"),
      query("SELECT COUNT(*) AS total FROM service_requests WHERE statut IN ('acceptee', 'terminee')"),
      query("SELECT COUNT(*) AS total FROM service_requests"),
      query("SELECT COUNT(DISTINCT client_id) AS total FROM payments WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY)"),
      query(`
        SELECT DATE_FORMAT(date_creation, '%Y-%m') AS month,
               COALESCE(SUM(commission_admin), 0) AS commission
        FROM payments
        WHERE date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(date_creation, '%Y-%m')
        ORDER BY month ASC
      `)
    ]);
    const conversion = allRequests.total ? (validatedRequests.total / allRequests.total) * 100 : 0;
    res.json({
      users: users.total,
      providers: providers.total,
      services: services.total,
      transactions: payments.total,
      commission: payments.commission,
      monthlyCommission: monthlyPayments,
      monthlyRevenue: payments.commission,
      validatedRequests: validatedRequests.total,
      conversion,
      activeClients: activeClients.total
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des statistiques" });
  }
});

router.get("/wallet", async (req, res) => {
  try {
    const admins = await query("SELECT id FROM users WHERE LOWER(role) = 'admin' ORDER BY id ASC LIMIT 1");
    if (!admins.length) return res.status(404).json({ message: "Compte admin introuvable" });
    const wallet = await ensureWalletForUser(admins[0].id);
    const transactions = await query("SELECT id, montant, description, solde_apres, date_creation FROM wallet_transactions WHERE user_id = ? AND description LIKE 'Commission admin%' ORDER BY id DESC", [admins[0].id]);
    res.json({ wallet, transactions, commissionRate: 20 });
  } catch (error) {
    console.error("Erreur portefeuille admin :", error);
    res.status(500).json({ message: "Erreur lors du chargement du portefeuille admin" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const rows = await query(`
      SELECT c.id, c.nom, c.description, c.image, COUNT(s.id) AS services
      FROM categories c LEFT JOIN services s ON s.categorie_id = c.id
      GROUP BY c.id, c.nom, c.description, c.image ORDER BY c.nom ASC
    `);
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Erreur lors du chargement des catégories" }); }
});

router.post("/categories", async (req, res) => {
  const { nom, description } = req.body;
  if (!nom?.trim()) return res.status(400).json({ message: "Le nom de la catégorie est obligatoire" });
  try {
    const result = await query("INSERT INTO categories (nom, description) VALUES (?, ?)", [nom.trim(), description || null]);
    res.status(201).json({ id: result.insertId, message: "Catégorie ajoutée" });
  } catch (error) { res.status(500).json({ message: "Erreur lors de la création de la catégorie" }); }
});

router.put("/categories/:id", async (req, res) => {
  const { nom, description } = req.body;
  if (!nom?.trim()) return res.status(400).json({ message: "Le nom de la catégorie est obligatoire" });
  try {
    const result = await query("UPDATE categories SET nom = ?, description = ? WHERE id = ?", [nom.trim(), description || null, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Catégorie introuvable" });
    res.json({ message: "Catégorie modifiée" });
  } catch (error) { res.status(500).json({ message: "Erreur lors de la modification" }); }
});

router.get("/services", async (req, res) => {
  try {
    const rows = await query(`
      SELECT s.id, s.nom, s.description, s.prix, s.ville, s.disponible, c.nom AS categorie,
             p.id AS prestataire_id, CONCAT(u.prenom, ' ', u.nom) AS prestataire
      FROM services s LEFT JOIN categories c ON c.id = s.categorie_id
      LEFT JOIN prestataires p ON p.id = s.prestataire_id LEFT JOIN users u ON u.id = p.user_id
      ORDER BY s.id DESC
    `);
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Erreur lors du chargement des services" }); }
});

router.post("/services", async (req, res) => {
  const { nom, description, prix, ville, categorie_id, prestataire_id } = req.body;
  if (!nom?.trim() || !Number(prix) || !categorie_id || !prestataire_id) return res.status(400).json({ message: "Nom, prix, catégorie et prestataire sont obligatoires" });
  try {
    const result = await query(`INSERT INTO services (nom, description, prix, ville, categorie_id, prestataire_id, disponible) VALUES (?, ?, ?, ?, ?, ?, 1)`, [nom.trim(), description || null, Number(prix), ville || null, categorie_id, prestataire_id]);
    res.status(201).json({ id: result.insertId, message: "Service ajouté" });
  } catch (error) { res.status(500).json({ message: "Erreur lors de la création du service" }); }
});

router.get("/prestataires", async (req, res) => {
  try {
    const rows = await query(`SELECT p.id, p.user_id, p.specialite, p.adresse, p.tarif, p.validation_status, u.nom, u.prenom, u.email, u.telephone FROM prestataires p JOIN users u ON u.id = p.user_id ORDER BY p.id DESC`);
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Erreur lors du chargement des prestataires" }); }
});

router.get("/demandes", async (req, res) => {
  try {
    const rows = await query(`
      SELECT r.id, r.prix, r.statut, r.description, NULL AS date_creation, s.nom AS service,
             CONCAT(c.prenom, ' ', c.nom) AS client, CONCAT(pu.prenom, ' ', pu.nom) AS prestataire
      FROM service_requests r LEFT JOIN services s ON s.id = r.service_id
      LEFT JOIN users c ON c.id = r.client_id LEFT JOIN prestataires p ON p.id = r.prestataire_id
      LEFT JOIN users pu ON pu.id = p.user_id ORDER BY r.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur admin demandes :", error);
    res.status(500).json({ message: "Erreur lors du chargement des demandes" });
  }
});

router.patch("/demandes/:id", async (req, res) => {
  const allowed = ["en_attente", "acceptee", "refusee", "terminee"];
  if (!allowed.includes(req.body.statut)) return res.status(400).json({ message: "Statut de demande invalide" });
  try {
    const result = await query("UPDATE service_requests SET statut = ? WHERE id = ?", [req.body.statut, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Demande introuvable" });
    res.json({ message: "Demande mise à jour" });
  } catch (error) { res.status(500).json({ message: "Erreur lors de la mise à jour de la demande" }); }
});

router.get("/payments", async (req, res) => {
  try {
    const rows = await query(`SELECT p.id, p.montant, p.commission_admin, p.montant_prestataire, p.status, p.date_creation, s.nom AS service, CONCAT(u.prenom, ' ', u.nom) AS client FROM payments p JOIN users u ON u.id = p.client_id JOIN services s ON s.id = p.service_id ORDER BY p.date_creation DESC`);
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Erreur lors du chargement des paiements" }); }
});

router.get("/transactions", async (req, res) => {
  try {
    const rows = await query(`SELECT wt.id, wt.type, wt.montant, wt.description, wt.solde_apres, wt.date_creation, CONCAT(u.prenom, ' ', u.nom) AS utilisateur FROM wallet_transactions wt JOIN users u ON u.id = wt.user_id ORDER BY wt.date_creation DESC`);
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Erreur lors du chargement des transactions" }); }
});

router.get("/users", async (req, res) => {
  try { res.json(await query("SELECT id, nom, prenom, email, telephone, role, ville, date_creation FROM users ORDER BY id DESC")); }
  catch (error) { res.status(500).json({ message: "Erreur lors du chargement des utilisateurs" }); }
});

module.exports = router;
