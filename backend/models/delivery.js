const mongoose = require('mongoose');

const deliveryInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  isVerified: { // To track if the mobile number is verified via OTP
    type: Boolean,
    default: false,
  },
  addressLine1: { // For Flat, House No., Building, Company, Apartment
    type: String,
    required: true,
  },
  addressLine2: { // For Area, Street, Sector, Village
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: false,
  },
  pinCode: {
    type: String,
    required: true,
  },
  townCity: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DeliveryInfo', deliveryInfoSchema);
