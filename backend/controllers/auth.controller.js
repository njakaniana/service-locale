const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// INSCRIPTION
// =========================
const register = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      mot_de_passe,
      role
    } = req.body;

    // Vérifier les champs obligatoires
    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs obligatoires"
      });
    }

    // Vérifier si l'email existe déjà
    const sqlCheck = "SELECT id FROM users WHERE email = ?";

    db.query(sqlCheck, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Erreur lors de la vérification de l'email"
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Cet email existe déjà"
        });
      }

      // Hasher le mot de passe
      const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);

      // Vérifier le rôle
      const roleFinal =
        role === "prestataire" ? "prestataire" : "client";

      const sqlInsert = `
        INSERT INTO users
        (nom, prenom, email, telephone, mot_de_passe, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sqlInsert,
        [
          nom,
          prenom,
          email,
          telephone,
          motDePasseHash,
          roleFinal
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Erreur lors de l'inscription"
            });
          }

          const userId = result.insertId;

          db.query(
            "INSERT INTO wallets (user_id, solde, devise) VALUES (?, 0.00, 'MGA') ON DUPLICATE KEY UPDATE user_id = user_id",
            [userId],
            (walletErr) => {
              if (walletErr) console.error("Création wallet :", walletErr);

              if (roleFinal === "prestataire") {
                db.query(
                  "INSERT INTO prestataires (user_id, specialite, bio) VALUES (?, '', '') ON DUPLICATE KEY UPDATE user_id = user_id",
                  [userId],
                  (providerErr) => {
                    if (providerErr) console.error("Création prestataire :", providerErr);
                    return res.status(201).json({ message: "Inscription réussie", userId });
                  }
                );
              } else {
                return res.status(201).json({ message: "Inscription réussie", userId });
              }
            }
          );
        }
      );
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};


// =========================
// CONNEXION
// =========================
const login = (req, res) => {
  const email = req.body.email || req.body.mail;
  const motDePasse = req.body.mot_de_passe ?? req.body.password ?? req.body.motDePasse;
  const requestedRole = req.body.role || req.body.selectedRole;

  if (!email || !motDePasse) {
    return res.status(400).json({
      message: "Email et mot de passe obligatoires"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Erreur serveur"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    const user = results[0];

    const motDePasseCorrect = await bcrypt.compare(
      motDePasse,
      user.mot_de_passe
    );

    if (!motDePasseCorrect) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({
        message: `Ce compte est enregistré comme ${user.role}. Sélectionnez le bon rôle pour vous connecter.`
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      }
    });
  });
};


module.exports = {
  register,
  login
};