const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/categories", (req, res) => {
  const sql = `
    SELECT id, nom, description, image
    FROM categories
    ORDER BY nom ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la récupération des catégories"
      });
    }

    res.json(results);
  });
});

router.get("/services", (req, res) => {
  const sql = `
    SELECT
      s.id,
      s.nom,
      s.description,
      s.prix,
      s.ville,
      s.image,
      s.disponible,
      c.id AS categorie_id,
      c.nom AS categorie,
      u.nom AS prestataire_nom,
      u.prenom AS prestataire_prenom,
      u.id AS prestataire_user_id,
      p.id AS prestataire_record_id
    FROM services s
    JOIN categories c ON c.id = s.categorie_id
    JOIN prestataires p ON p.id = s.prestataire_id
    JOIN users u ON u.id = p.user_id
    WHERE s.disponible = 1 AND p.validation_status = 'accepted'
    ORDER BY s.date_creation DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la récupération des services"
      });
    }

    const services = results.map((service) => ({
      ...service,
      prix: Number(service.prix).toLocaleString("fr-FR") + " Ar",
      montant: Number(service.prix),
      prestataire_id: service.prestataire_user_id,
      prestataire_record_id: service.prestataire_record_id,
      prestataire: `${service.prestataire_prenom || ""} ${service.prestataire_nom || ""}`.trim()
    }));

    res.json(services);
  });
});

module.exports = router;
