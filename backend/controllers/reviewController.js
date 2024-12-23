const Review = require("../models/review");
const fs = require('fs');
const path = require('path');
const cleanupUploadedFiles = require("../utils/cleanupUploadedFiles");
const mongoose = require('mongoose');

// Add Product Review
exports.addReview = async (req, res) => {
  try {
    // Assuming userId is set in req.user by authentication middleware
    const userId = req.user.id;

    const { productId, rating, reviewTitle, comment } = req.body;

    // Normalize file paths to use forward slashes
    const reviewImages =
      req.files
        ?.filter(file => file.fieldname === 'reviewImages')
        .map(file => file.path.replace(/\\/g, '/')) || [];
    const reviewVideos =
      req.files
        ?.filter(file => file.fieldname === 'reviewVideos')
        .map(file => file.path.replace(/\\/g, '/')) || [];

    // Create a new review
    const newReview = new Review({
      productId,
      userId,
      rating,
      reviewTitle,
      comment,
      reviewImages,
      reviewVideos,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully!', review: savedReview });
  } catch (error) {
    console.error('Error during addReview:', error.message);

    // Cleanup uploaded files if the operation fails
    await cleanupUploadedFiles(req.files);

    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// Edit Review
// exports.editReview = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { reviewId, productId, rating, reviewTitle, comment } = req.body;

//     // Fetch the existing review to preserve current images/videos
//     const review = await Review.findById(reviewId);

//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     // Ensure the review belongs to the logged-in user
//     if (review.userId.toString() !== userId) {
//       return res.status(403).json({ message: 'You can only edit your own reviews' });
//     }

//     // Handle review images
//     const newReviewImages =
//       req.files?.filter(file => file.fieldname === 'reviewImages').map(file => file.path.replace(/\\/g, '/')) || [];

//     if (newReviewImages.length > 0) {
//       // Delete old review images if new ones are provided
//       review.reviewImages.forEach((imagePath) => {
//         const imageFullPath = path.join(__dirname, '..', imagePath); // Resolve to the absolute path
//         try {
//           if (fs.existsSync(imageFullPath)) {
//             fs.unlinkSync(imageFullPath); // Synchronously delete the old image
//           }
//         } catch (error) {
//           console.error(`Failed to delete image ${imageFullPath}: ${error.message}`);
//         }
//       });
//     }

//     const updatedReviewImages = newReviewImages.length > 0 ? newReviewImages : review.reviewImages;

//     // Handle review videos
//     const newReviewVideos =
//       req.files?.filter(file => file.fieldname === 'reviewVideos').map(file => file.path.replace(/\\/g, '/')) || [];

//     if (newReviewVideos.length > 0) {
//       // Delete old review videos if new ones are provided
//       review.reviewVideos.forEach((videoPath) => {
//         const videoFullPath = path.join(__dirname, '..', videoPath); // Resolve to the absolute path
//         try {
//           if (fs.existsSync(videoFullPath)) {
//             fs.unlinkSync(videoFullPath); // Synchronously delete the old video
//           }
//         } catch (error) {
//           console.error(`Failed to delete video ${videoFullPath}: ${error.message}`);
//         }
//       });
//     }

//     const updatedReviewVideos = newReviewVideos.length > 0 ? newReviewVideos : review.reviewVideos;

//     // Update the review with new data
//     review.productId = productId || review.productId;
//     review.rating = rating || review.rating;
//     review.reviewTitle = reviewTitle || review.reviewTitle;
//     review.comment = comment || review.comment;
//     review.reviewImages = updatedReviewImages;
//     review.reviewVideos = updatedReviewVideos;

//     // Save the updated review
//     const updatedReview = await review.save();

//     res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating review', error: error.message });
//   }
// };

// Edit Review
exports.editReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId, productId, rating, reviewTitle, comment } = req.body;

    console.log('Request Body:', req.body);
    console.log('Review ID:', req.body.reviewId);


    // Validate reviewId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    // Fetch the existing review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the review belongs to the logged-in user
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    // Handle new media files
    const newReviewImages =
      req.files?.filter(file => file.fieldname === 'reviewImages').map(file => file.path.replace(/\\/g, '/')) || [];
    const newReviewVideos =
      req.files?.filter(file => file.fieldname === 'reviewVideos').map(file => file.path.replace(/\\/g, '/')) || [];

    // Determine the final images and videos to retain
    const updatedReviewImages =
      newReviewImages.length > 0
        ? newReviewImages
        : review.reviewImages; // Default to existing images if no new ones provided
    const updatedReviewVideos =
      newReviewVideos.length > 0
        ? newReviewVideos
        : review.reviewVideos; // Default to existing videos if no new ones provided

    // Update the review with new data
    review.productId = productId || review.productId;
    review.rating = rating || review.rating;
    review.reviewTitle = reviewTitle || review.reviewTitle;
    review.comment = comment || review.comment;
    review.reviewImages = updatedReviewImages;
    review.reviewVideos = updatedReviewVideos;

    // Save the updated review
    const updatedReview = await review.save();

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};



// Get reviews for a specific product
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Pagination parameters

  try {
    // Fetch reviews with pagination
    const reviews = await Review.find({ productId })
      .populate('userId', 'username profilePicture') // Include username and profile picture
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Total review count and average rating
    const totalReviews = await Review.countDocuments({ productId });
    const averageRating = totalReviews > 0
      ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
      : 'No ratings yet';

    res.status(200).json({ reviews, averageRating, totalReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    // Find the review by ID
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the review belongs to the logged-in user
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    // Cleanup review images
    if (review.reviewImages && review.reviewImages.length > 0) {
      review.reviewImages.forEach((imagePath) => {
        const imageFullPath = path.join(__dirname, '..', imagePath); // Resolve to the absolute path
        if (fs.existsSync(imageFullPath)) {
          fs.unlinkSync(imageFullPath); // Delete the old image
        }
      });
    }

    // Cleanup review videos
    if (review.reviewVideos && review.reviewVideos.length > 0) {
      review.reviewVideos.forEach((videoPath) => {
        const videoFullPath = path.join(__dirname, '..', videoPath); // Resolve to the absolute path
        if (fs.existsSync(videoFullPath)) {
          fs.unlinkSync(videoFullPath); // Delete the old video
        }
      });
    }

    // Delete the review from the database
    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};


