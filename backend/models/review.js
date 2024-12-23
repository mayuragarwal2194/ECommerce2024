const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewTitle: {
    type: String,
    required: true,
    maxlength: 100, // Optional: Set a character limit
  },
  comment: {
    type: String,
    required: true,
  },
  reviewImages: [
    {
      type: String, // Storing image URLs or paths
      default: [],
    },
  ],
  reviewVideos: [
    {
      type: String, // Storing video URLs or paths
      default: [],
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
