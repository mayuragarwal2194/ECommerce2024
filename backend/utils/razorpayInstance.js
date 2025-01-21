const Razorpay = require("razorpay");

// Create and export the Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use environment variables for security
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use environment variables for security
});

module.exports = razorpayInstance;