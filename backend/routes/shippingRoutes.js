const express = require('express');
const { addShippingRule, updateShippingRule, deleteShippingRule, calculateShippingCharges } = require('../controllers/shippingController');
const { uploadNone } = require('../config/multerConfig');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to dynamically add a shipping rule
router.post('/', uploadNone, addShippingRule);
router.put('/:id',uploadNone, updateShippingRule);
router.delete('/:id', deleteShippingRule);
router.post('/calculate-shipping', authMiddleware ,calculateShippingCharges);
module.exports = router;