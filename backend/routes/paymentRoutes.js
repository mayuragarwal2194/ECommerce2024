const express = require("express");
const { checkout, verifyPayment } = require("../controllers/paymentController");
const router = express.Router();

router.post('/checkout', checkout);
router.post("/verify", verifyPayment);

module.exports = router;