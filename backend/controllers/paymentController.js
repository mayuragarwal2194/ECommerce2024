const razorpayInstance = require("../utils/razorpayInstance");
const crypto = require('crypto');

exports.checkout = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
         message: "Invalid amount provided. Must be a positive number.",
      });
    }

    const options = {
      amount: amount, // Amount in paise
      currency: "INR",
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order",
    });
  }
};

exports.verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Use Razorpay secret key to generate expected signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};
