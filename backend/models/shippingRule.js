const mongoose = require('mongoose');

const shippingRuleSchema = new mongoose.Schema({
  weightRange: {
    min: { type: Number, required: true }, // Minimum weight in kg
    max: { type: Number, required: true }, // Maximum weight in kg
  },
  distanceRange: {
    min: { type: Number, required: true }, // Minimum distance in km
    max: { type: Number, required: true }, // Maximum distance in km
  },
  charges: {
    type: Number, // Base charge for the given weight and distance range
    required: true,
  },
});

// Add a unique index to prevent duplicates
shippingRuleSchema.index(
  {
    'weightRange.min': 1,
    'weightRange.max': 1,
    'distanceRange.min': 1,
    'distanceRange.max': 1,
  },
  { unique: true }
);

module.exports = mongoose.model('ShippingRule', shippingRuleSchema);