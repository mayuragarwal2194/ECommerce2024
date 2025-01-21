const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product.variants', // Reference to a specific variant within the product
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      newPrice: {
        type: Number,
        required: true
      },
      oldPrice: {
        type: Number
      },
      size: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      weight: {
        type: Number, // Weight in kilograms (or grams if your platform prefers)
        required: true,
        default: 0,
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  totalWeight: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  coupon: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 }, // Amount discounted
  },
  finalTotal: {
    type: Number,
    required: true,
    default: 0, // Final total after applying discounts
  }

},
  { timestamps: true }
);
// Middleware to initialize or update finalTotal based on totalPrice
cartSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('totalPrice') || this.isModified('coupon')) {
    // Ensure finalTotal reflects the updated totalPrice or applied discount
    this.finalTotal = this.totalPrice - (this.coupon?.discountAmount || 0);
  }
  next();
});


module.exports = mongoose.model('Cart', cartSchema);