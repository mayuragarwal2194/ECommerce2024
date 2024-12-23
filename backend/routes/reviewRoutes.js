const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, editReview, deleteReview } = require('../controllers/reviewController'); // Import editReview controller
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadMiddleware, handleMulterError } = require('../config/multerConfig');

// Route to add a review
router.post('/', authMiddleware, uploadMiddleware, handleMulterError, addReview);

// Route to get product reviews
router.get('/:productId', getProductReviews);

// Route to edit a review (PUT request)
router.put('/editReview', authMiddleware, uploadMiddleware, handleMulterError, editReview);

// Route to delete a review (DELETE request)
router.delete('/:reviewId', authMiddleware, deleteReview); 

module.exports = router;