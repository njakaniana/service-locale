const express = require("express");
const router = express.Router();

const {
  getClientDemandes,
  getClientNotifications,
  createServiceRequest,
  getServiceById
} = require("../controllers/client.controller");

router.get("/demandes/:userId", getClientDemandes);
router.get("/notifications/:userId", getClientNotifications);
router.post("/demande", createServiceRequest);
router.get("/service/:id", getServiceById);

module.exports = router;
