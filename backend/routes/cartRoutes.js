const express = require('express');
const router = express.Router();
const { getCart } = require('../controllers/cartController/getCartController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addToCart } = require('../controllers/cartController/addToCartController');
const { updateQuantity } = require('../controllers/cartController/updateQuantityController');

// Route to add a product variant to the cart
router.post('/cart', authMiddleware, addToCart);

router.get('/cart', authMiddleware, getCart);

// Route to update the quantity of a cart item
router.put('/cart/quantity', authMiddleware, updateQuantity);

module.exports = router;
