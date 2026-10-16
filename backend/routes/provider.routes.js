const express = require("express");
const { getProviderDashboard, submitProviderProfile } = require("../controllers/provider.controller");

const router = express.Router();

router.post("/profil", submitProviderProfile);
router.get("/dashboard/:userId", getProviderDashboard);

module.exports = router;