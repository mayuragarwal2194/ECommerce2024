const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.post('/wishlist', authMiddleware, addToWishlist);
router.get('/wishlist', authMiddleware, getWishlist);
router.delete('/wishlist/:productId/:variantId', authMiddleware, removeFromWishlist);
module.exports = router;