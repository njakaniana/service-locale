const express = require("express");
const router = express.Router();

const db = require("../config/db");

// Récupérer tous les utilisateurs
router.get("/", (req, res) => {
  const sql = `
    SELECT id, nom, prenom, email, telephone, role, ville, date_creation
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la récupération des utilisateurs"
      });
    }

    res.json(results);
  });
});

router.get("/prestataires/demandes", (req, res) => {
  const sql = `
        SELECT p.id AS prestataire_id, p.user_id, p.specialite, p.adresse, p.tarif,
          p.validation_status, u.nom, u.prenom, u.email, u.telephone
    FROM prestataires p
    JOIN users u ON u.id = p.user_id
    WHERE p.validation_status = 'pending'
    ORDER BY p.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur demandes prestataires :", err);
      return res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
    }
    res.json(results);
  });
});

router.patch("/prestataires/:providerId/validation", (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Statut de validation invalide" });
  }

  const sql = `
    UPDATE prestataires p
    JOIN users u ON u.id = p.user_id
    SET p.validation_status = ?
    WHERE p.id = ?
  `;
  db.query(sql, [status, req.params.providerId], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la validation" });
    if (!result.affectedRows) return res.status(404).json({ message: "Demande introuvable" });

    const notification = status === "accepted" ? "Votre profil prestataire a été accepté." : "Votre profil prestataire a été refusé.";
    db.query("SELECT user_id FROM prestataires WHERE id = ?", [req.params.providerId], (lookupError, rows) => {
      if (!lookupError && rows.length) {
        db.query("INSERT INTO notifications (user_id, titre, message, type, lu) VALUES (?, ?, ?, 'profile', 0)", [rows[0].user_id, "Validation du profil", notification]);
      }
    });

    if (status === "accepted") {
      const serviceSql = `
        INSERT INTO services (nom, description, prix, ville, categorie_id, prestataire_id, disponible)
        SELECT p.specialite, CONCAT('Service proposé par ', u.prenom, ' ', u.nom),
               CAST(REPLACE(REPLACE(REPLACE(p.tarif, 'Ar', ''), ' ', ''), ',', '.') AS DECIMAL(10,2)),
               u.ville, (SELECT id FROM categories ORDER BY id LIMIT 1), p.id, 1
        FROM prestataires p JOIN users u ON u.id = p.user_id
        WHERE p.id = ? AND p.specialite IS NOT NULL AND p.specialite <> ''
          AND NOT EXISTS (SELECT 1 FROM services s WHERE s.prestataire_id = p.id AND s.nom = p.specialite)
      `;
      db.query(serviceSql, [req.params.providerId]);
    }

    res.json({ message: status === "accepted" ? "Prestataire accepté" : "Prestataire refusé", status });
  });
});

module.exports = router;