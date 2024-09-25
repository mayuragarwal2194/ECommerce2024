const Review = require("../models/review");

// Add a new review
exports.addReview = async (req, res) => {
  const { productId, userName, rating, comment } = req.body;
  try {
    const newReview = new Review({
      productId,
      userName,
      rating,
      comment,
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error });
  }
};

// Get reviews for a specific product
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId });
    const averageRating = reviews.length > 0
      ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
      : 'No ratings yet';
    res.status(200).json({ reviews, averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

