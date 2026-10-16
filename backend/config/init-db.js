const db = require("./db");

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

async function ensureColumn(tableName, columnName, definition) {
  const columns = await query(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [columnName]);

  if (!columns.length) {
    await query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function initializeDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        solde DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        devise VARCHAR(10) NOT NULL DEFAULT 'MGA',
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wallet_user (user_id),
        KEY idx_wallet_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        prestataire_id INT NOT NULL,
        admin_id INT NOT NULL,
        service_id INT NOT NULL,
        montant DECIMAL(10,2) NOT NULL,
        commission_admin DECIMAL(10,2) NOT NULL,
        montant_prestataire DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'payé',
        description VARCHAR(255) DEFAULT NULL,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_payment_client (client_id),
        KEY idx_payment_prestataire (prestataire_id),
        KEY idx_payment_admin (admin_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        wallet_id INT NOT NULL,
        payment_id INT NULL,
        type ENUM('debit','credit') NOT NULL,
        montant DECIMAL(10,2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        solde_apres DECIMAL(10,2) NOT NULL,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_wallet_tx_user (user_id),
        KEY idx_wallet_tx_payment (payment_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT,
        prix DECIMAL(10,2) NOT NULL,
        ville VARCHAR(255),
        categorie_id INT,
        prestataire_id INT,
        disponible TINYINT(1) DEFAULT 1,
        image VARCHAR(255),
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS prestataires (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        specialite VARCHAR(255),
        bio TEXT,
        validation_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_prestataire_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await ensureColumn("prestataires", "specialite", "VARCHAR(255)");
    await ensureColumn("prestataires", "bio", "TEXT");
    await ensureColumn("prestataires", "adresse", "VARCHAR(255)");
    await ensureColumn("prestataires", "tarif", "VARCHAR(100)");
    await ensureColumn("prestataires", "validation_status", "VARCHAR(20) NOT NULL DEFAULT 'pending'");
    await query(`
      UPDATE prestataires p
      JOIN users u ON u.id = p.user_id
      SET p.validation_status = 'accepted'
      WHERE u.email = 'prestataire@service-mada.com'
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        prestataire_id INT NOT NULL,
        service_id INT NOT NULL,
        prix DECIMAL(10,2) NOT NULL,
        statut VARCHAR(50) DEFAULT 'en_attente',
        description TEXT,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        titre VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        lu TINYINT(1) DEFAULT 0,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const categorySeeds = [
      ["Informatique", "Services informatiques", "tech"],
      ["Beauté", "Soins et beauté", "beauty"],
      ["Maison", "Services à domicile", "home"],
      ["Transport", "Transport local", "transport"]
    ];

    for (const [name, description, image] of categorySeeds) {
      const categoryRows = await query("SELECT id FROM categories WHERE nom = ? LIMIT 1", [name]);
      if (!categoryRows.length) {
        await query(
          "INSERT INTO categories (nom, description, image) VALUES (?, ?, ?)",
          [name, description, image]
        );
      }
    }

    const categoryRows = await query(
      "SELECT id, nom FROM categories WHERE nom IN (?, ?, ?, ?)",
      categorySeeds.map(([name]) => name)
    );
    const categoryIds = Object.fromEntries(categoryRows.map(({ id, nom }) => [nom, id]));

    const demoUsers = await query(
      "SELECT email FROM users WHERE email IN (?, ?, ?)",
      [
        "admin@gmail.com",
        "prestataire@service-mada.com",
        "client@service-mada.com"
      ]
    );

    if (demoUsers.length < 3) {
      const bcrypt = require("bcryptjs");
      const adminPassword = await bcrypt.hash("admin123", 10);
      const prestatairePassword = await bcrypt.hash("prestataire123", 10);
      const clientPassword = await bcrypt.hash("client123", 10);

      const users = await query(
        `
          INSERT INTO users (nom, prenom, email, telephone, mot_de_passe, role)
          VALUES
            ('Admin', 'Service Mada', 'admin@gmail.com', '0340000000', ?, 'admin'),
            ('Rajaona', 'Jean', 'prestataire@service-mada.com', '0341111111', ?, 'prestataire'),
            ('Rakoto', 'Aina', 'client@service-mada.com', '0342222222', ?, 'client')
          ON DUPLICATE KEY UPDATE email = VALUES(email)
        `,
        [adminPassword, prestatairePassword, clientPassword]
      );

      const createdAdmin = await query("SELECT id FROM users WHERE email = 'admin@gmail.com' LIMIT 1");
      const createdPrestataire = await query("SELECT id FROM users WHERE email = 'prestataire@service-mada.com' LIMIT 1");
      const createdClient = await query("SELECT id FROM users WHERE email = 'client@service-mada.com' LIMIT 1");

      if (createdAdmin.length) {
        await query("INSERT INTO wallets (user_id, solde, devise) VALUES (?, 500000.00, 'MGA') ON DUPLICATE KEY UPDATE solde = solde", [createdAdmin[0].id]);
      }

      if (createdPrestataire.length) {
        await query("INSERT INTO prestataires (user_id, specialite, bio, validation_status) VALUES (?, 'Informatique', 'Prestataire de service numérique', 'accepted') ON DUPLICATE KEY UPDATE specialite = VALUES(specialite), validation_status = 'accepted'", [createdPrestataire[0].id]);
        await query("INSERT INTO wallets (user_id, solde, devise) VALUES (?, 300000.00, 'MGA') ON DUPLICATE KEY UPDATE solde = solde", [createdPrestataire[0].id]);
      }

      if (createdClient.length) {
        await query("INSERT INTO wallets (user_id, solde, devise) VALUES (?, 1000000.00, 'MGA') ON DUPLICATE KEY UPDATE solde = solde", [createdClient[0].id]);
      }

      const prestataireRow = await query("SELECT id FROM prestataires WHERE user_id = ? LIMIT 1", [createdPrestataire[0].id]);
      const serviceRows = await query("SELECT COUNT(*) AS total FROM services");
      if (serviceRows[0].total === 0 && prestataireRow.length) {
        await query(`
          INSERT INTO services (nom, description, prix, ville, categorie_id, prestataire_id, disponible, image)
          VALUES
            ('Création de site web', 'Création de sites web modernes et adaptés aux besoins des clients.', 150000.00, 'Antananarivo', ?, ?, 1, 'site'),
            ('Réparation ordinateur', 'Diagnostic et réparation de PC et accessoires.', 50000.00, 'Antananarivo', ?, ?, 1, 'repair'),
            ('Coiffure à domicile', 'Service de coiffure premium à domicile.', 30000.00, 'Antananarivo', ?, ?, 1, 'beauty')
        `, [
          categoryIds.Informatique, prestataireRow[0].id,
          categoryIds.Informatique, prestataireRow[0].id,
          categoryIds.Beauté, prestataireRow[0].id
        ]);
      }

      const notificationRows = await query("SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?", [createdClient[0].id]);
      if (notificationRows[0].total === 0) {
        await query(`
          INSERT INTO notifications (user_id, titre, message, type, lu)
          VALUES
            (?, 'Demande acceptée', 'Votre demande de réparation ordinateur a été acceptée.', 'service', 0),
            (?, 'Paiement effectué', 'Votre paiement a été enregistré avec succès.', 'payment', 0),
            (?, 'Nouveau service', 'Un nouveau service informatique est disponible près de vous.', 'info', 0)
        `, [createdClient[0].id, createdClient[0].id, createdClient[0].id]);
      }
    }

    // Keep the payment recipient available even when the database already
    // contains custom users and the demo seed was skipped.
    const adminRows = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (!adminRows.length) {
      const bcrypt = require("bcryptjs");
      const adminPassword = await bcrypt.hash("admin123", 10);
      await query(
        `INSERT INTO users (nom, prenom, email, telephone, mot_de_passe, role)
         VALUES ('Admin', 'Service Mada', 'admin@gmail.com', '0340000000', ?, 'admin')
         ON DUPLICATE KEY UPDATE role = 'admin'`,
        [adminPassword]
      );
      const createdAdmin = await query("SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1");
      if (createdAdmin.length) {
        await query(
          "INSERT INTO wallets (user_id, solde, devise) VALUES (?, 0.00, 'MGA') ON DUPLICATE KEY UPDATE user_id = user_id",
          [createdAdmin[0].id]
        );
      }
    } else {
      await query(
        "INSERT INTO wallets (user_id, solde, devise) VALUES (?, 0.00, 'MGA') ON DUPLICATE KEY UPDATE user_id = user_id",
        [adminRows[0].id]
      );
    }

    const serviceRows = await query("SELECT COUNT(*) AS total FROM services");
    if (serviceRows[0].total === 0) {
      const prestataires = await query("SELECT id FROM prestataires LIMIT 1");
      if (prestataires.length) {
        await query(`
          INSERT INTO services (nom, description, prix, ville, categorie_id, prestataire_id, disponible, image)
          VALUES
            ('Création de site web', 'Création de sites web modernes et adaptés aux besoins des clients.', 150000.00, 'Antananarivo', ?, ?, 1, 'site'),
            ('Réparation ordinateur', 'Diagnostic et réparation de PC et accessoires.', 50000.00, 'Antananarivo', ?, ?, 1, 'repair'),
            ('Coiffure à domicile', 'Service de coiffure premium à domicile.', 30000.00, 'Antananarivo', ?, ?, 1, 'beauty')
        `, [
          categoryIds.Informatique, prestataires[0].id,
          categoryIds.Informatique, prestataires[0].id,
          categoryIds.Beauté, prestataires[0].id
        ]);
      }
    }

    console.log("✅ Tables de portefeuille, services, demandes et notifications vérifiées.");
  } catch (error) {
    console.error("❌ Erreur initialisation base de données :", error.message);
  }
}

async function ensureWalletForUser(userId) {
  if (!userId) {
    throw new Error("Identifiant utilisateur requis");
  }

  const rows = await query("SELECT * FROM wallets WHERE user_id = ? LIMIT 1", [userId]);

  if (rows.length > 0) {
    return rows[0];
  }

  const result = await query(
    "INSERT INTO wallets (user_id, solde, devise) VALUES (?, 0.00, 'MGA')",
    [userId]
  );

  return {
    id: result.insertId,
    user_id: userId,
    solde: 0.00,
    devise: "MGA"
  };
}

module.exports = {
  initializeDatabase,
  ensureWalletForUser,
  query
};
