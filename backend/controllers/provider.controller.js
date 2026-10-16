const db = require("../config/db");

const getProviderDashboard = (req, res) => {
  const { userId } = req.params;
  const providerQuery = "SELECT id FROM prestataires WHERE user_id = ? LIMIT 1";

  db.query(providerQuery, [userId], (providerError, providers) => {
    if (providerError) {
      console.error(providerError);
      return res.status(500).json({ message: "Erreur lors du chargement du tableau de bord" });
    }

    const providerId = providers[0]?.id;
    const queries = [
      ["SELECT COUNT(*) AS total FROM services WHERE prestataire_id = ?", [providerId || 0]],
      ["SELECT COUNT(*) AS total FROM service_requests WHERE prestataire_id = ?", [providerId || 0]],
      ["SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND lu = 0", [userId]],
      ["SELECT solde, devise FROM wallets WHERE user_id = ? LIMIT 1", [userId]]
    ];

    Promise.all(queries.map(([sql, params]) => new Promise((resolve, reject) => {
      db.query(sql, params, (error, result) => error ? reject(error) : resolve(result));
    })))
      .then(([services, demands, notifications, wallets]) => res.json({
        services: services[0]?.total || 0,
        demands: demands[0]?.total || 0,
        notifications: notifications[0]?.total || 0,
        wallet: wallets[0] || { solde: 0, devise: "MGA" }
      }))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Erreur lors du chargement du tableau de bord" });
      });
  });
};

const submitProviderProfile = (req, res) => {
  const { user_id, nom, prenom, email, telephone, ville, adresse, service, tarif } = req.body;

  if (!user_id || !nom || !prenom || !email || !telephone || !ville || !adresse || !service || !tarif) {
    return res.status(400).json({ message: "Tous les champs du profil sont obligatoires" });
  }

  const updateUserSql = `
    UPDATE users
    SET nom = ?, prenom = ?, email = ?, telephone = ?, ville = ?
    WHERE id = ? AND role = 'prestataire'
  `;

  db.query(updateUserSql, [nom, prenom, email, telephone, ville, user_id], (userError, userResult) => {
    if (userError) {
      console.error(userError);
      return res.status(500).json({ message: "Erreur lors de l'enregistrement du profil" });
    }

    if (!userResult.affectedRows) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    const providerSql = `
      INSERT INTO prestataires (user_id, specialite, bio, adresse, tarif, validation_status)
      VALUES (?, ?, '', ?, ?, 'pending')
      ON DUPLICATE KEY UPDATE specialite = VALUES(specialite), adresse = VALUES(adresse), tarif = VALUES(tarif), validation_status = 'pending'
    `;

    db.query(providerSql, [user_id, service, adresse, tarif], (providerError) => {
      if (providerError) {
        console.error(providerError);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement du service" });
      }

      res.json({ message: "Profil envoyé à l'administration", status: "pending" });
    });
  });
};

module.exports = { getProviderDashboard, submitProviderProfile };