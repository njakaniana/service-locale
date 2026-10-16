const express = require("express");
const router = express.Router();

const {
  payService,
  getWalletByUser,
  getTransactionsByUser,
  depositWallet,
  withdrawWallet
} = require("../controllers/payments.controller");

router.post("/pay-service", payService);
router.get("/wallet/:userId", getWalletByUser);
router.get("/transactions/:userId", getTransactionsByUser);
router.post("/wallet/deposit", depositWallet);
router.post("/wallet/withdraw", withdrawWallet);

module.exports = router;
