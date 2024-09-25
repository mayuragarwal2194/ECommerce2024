const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/reviewController');

router.post('/', addReview);
router.get('/:productId', getProductReviews);

module.exports = router;