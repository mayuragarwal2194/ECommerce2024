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
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);