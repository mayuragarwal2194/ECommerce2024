const express = require('express');
const { addCoupon, deleteCoupon, editCoupon, verifyCoupon, applyDiscount, getAllCoupons, removeCoupon } = require('../controllers/couponController');
const { uploadNone } = require('../config/multerConfig');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Route for adding a coupon (protected for admin only)
router.post('/', uploadNone, addCoupon);
router.delete('/:id', deleteCoupon);
router.put('/:id', uploadNone, editCoupon);
router.get('/', getAllCoupons);

// Verify coupon route
router.post('/verify', uploadNone, verifyCoupon);

// Apply discount route
router.post('/apply', uploadNone, authMiddleware, applyDiscount);

router.post('/remove', uploadNone, authMiddleware, removeCoupon);

module.exports = router;