const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () { return !this.googleId; }, // Only require password if googleId is not set
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null or undefined without enforcing uniqueness on non-Google users
  },
  isVerified: {
    type: Boolean,
    default: false, // User is not verified initially
  },
  confirmationToken: {
    type: String,
    default: '',
  },
  tokenExpiry: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
    default: '',
  },
  passwordResetExpiry: {
    type: Date,
  },
  profilePicture: {
    type: String,
    default: ''
  },
  deliveryInfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryInfo',
    }
  ],
  defaultAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryInfo',
    default: null
  },
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist', // Reference to the Wishlist model
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart' // Reference to the Cart model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate confirmation token method
UserSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(20).toString('hex'); // 40-char token
  this.confirmationToken = token;
  this.tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
  return token;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;