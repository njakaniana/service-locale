const db = require("../config/db");

const getClientDemandes = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Identifiant utilisateur requis" });
  }

  const sql = `
    SELECT dr.id, dr.service_id, dr.prestataire_id, dr.prix, dr.statut, dr.description,
           dr.date_creation,
           s.nom AS service,
           u.nom AS prestataire_nom,
           u.prenom AS prestataire_prenom
    FROM service_requests dr
    LEFT JOIN services s ON s.id = dr.service_id
    LEFT JOIN prestataires p ON p.id = dr.prestataire_id
    LEFT JOIN users u ON u.id = p.user_id
    WHERE dr.client_id = ?
    ORDER BY dr.date_creation DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
    }

    const demandes = results.map((item) => ({
      id: item.id,
      service: item.service || "Service",
      prestataire: `${item.prestataire_prenom || ""} ${item.prestataire_nom || ""}`.trim() || "Prestataire",
      date: item.date_creation ? new Date(item.date_creation).toLocaleDateString("fr-FR") : "",
      prix: `${Number(item.prix || 0).toLocaleString("fr-FR")} Ar`,
      statut: item.statut || "en_attente",
      description: item.description || ""
    }));

    res.json(demandes);
  });
};

const getClientNotifications = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Identifiant utilisateur requis" });
  }

  const sql = `
    SELECT id, titre, message, type, lu, date_creation
    FROM notifications
    WHERE user_id = ?
    ORDER BY date_creation DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
    }

    const notifications = results.map((item) => ({
      id: item.id,
      titre: item.titre,
      message: item.message,
      type: item.type,
      lu: Boolean(item.lu),
      date: item.date_creation ? new Date(item.date_creation).toLocaleDateString("fr-FR") : ""
    }));

    res.json(notifications);
  });
};

const createServiceRequest = (req, res) => {
  const { client_id, prestataire_id, service_id, prix, description } = req.body;

  if (!client_id || !prestataire_id || !service_id || !prix) {
    return res.status(400).json({ message: "Informations incomplètes pour créer la demande" });
  }

  const sql = `
    INSERT INTO service_requests (client_id, prestataire_id, service_id, prix, statut, description)
    VALUES (?, ?, ?, ?, 'en_attente', ?)
  `;

  db.query("SELECT prenom, nom, email, telephone FROM users WHERE id = ? LIMIT 1", [client_id], (clientError, clientRows) => {
    if (clientError) {
      console.error(clientError);
      return res.status(500).json({ message: "Erreur lors de la récupération du profil client" });
    }

    const client = clientRows[0] || {};
    const clientName = `${client.prenom || ""} ${client.nom || ""}`.trim() || "Client";
    const clientContact = [client.email, client.telephone].filter(Boolean).join(" | ") || "Aucun contact renseigné";

    db.query(sql, [client_id, prestataire_id, service_id, prix, description || "Demande de service"], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la création de la demande" });
      }

      const clientNotificationSql = `
        INSERT INTO notifications (user_id, titre, message, type, lu)
        VALUES (?, ?, ?, 'service', 0)
      `;

      db.query(clientNotificationSql, [
        client_id,
        "Demande enregistrée",
        "Votre demande de service a bien été enregistrée."
      ]);

      const providerNotificationSql = `
        INSERT INTO notifications (user_id, titre, message, type, lu)
        VALUES (?, ?, ?, 'service', 0)
      `;

      db.query(providerNotificationSql, [
        prestataire_id,
        "Nouvelle demande de service",
        `Nouveau client : ${clientName}. Contact : ${clientContact}.`
      ]);

      res.status(201).json({
        message: "Demande créée avec succès",
        id: result.insertId
      });
    });
  });
};

const getServiceById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT s.id, s.nom, s.description, s.prix, s.ville, s.image, s.disponible,
           c.nom AS categorie,
           p.id AS prestataire_record_id,
           u.id AS prestataire_id,
           CONCAT(COALESCE(u.prenom,''), ' ', COALESCE(u.nom,'')) AS prestataire
    FROM services s
    JOIN categories c ON c.id = s.categorie_id
    JOIN prestataires p ON p.id = s.prestataire_id
    JOIN users u ON u.id = p.user_id
    WHERE s.id = ? LIMIT 1`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération du service" });
    if (!results.length) return res.status(404).json({ message: "Service introuvable" });
    const service = results[0];
    service.prix = Number(service.prix);
    res.json(service);
  });
};

module.exports = {
  getClientDemandes,
  getClientNotifications,
  createServiceRequest,
  getServiceById
};
