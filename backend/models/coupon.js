const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  maximumDiscountValue: {
    type: Number,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
