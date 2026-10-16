require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const catalogRoutes = require("./routes/catalog.routes");
const paymentsRoutes = require("./routes/payments.routes");
const clientRoutes = require("./routes/client.routes");
const providerRoutes = require("./routes/provider.routes");
const adminRoutes = require("./routes/admin.routes");

const db = require("./config/db");
const { initializeDatabase } = require("./config/init-db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/prestataire", providerRoutes);
app.use("/api/admin", adminRoutes);

// Accueil API
app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API Service Mada 2.0 🚀"
    });
});

// Test MySQL
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS test", (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Erreur MySQL",
                error: err
            });
        }

        res.json({
            message: "✅ API connectée à MySQL !",
            result
        });
    });
});

const PORT = 5000;

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Impossible d'initialiser la base :", error);
        process.exit(1);
    });