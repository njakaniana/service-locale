const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "service_mada"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Erreur de connexion MySQL :", err);
        return;
    }

    console.log("✅ MySQL connecté !");
});

module.exports = db;