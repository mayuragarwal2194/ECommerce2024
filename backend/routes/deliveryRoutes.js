// routes/deliveryRoutes.js
const express = require('express');
const { saveDeliveryInfo, getCountries, getStatesByCountry, getCitiesByState, getDeliveryInfo, setDefaultAddress, deleteAddress, editDeliveryInfo } = require('../controllers/deliveryController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware to protect routes

const router = express.Router();

// Save delivery infos
router.post('/', authMiddleware, saveDeliveryInfo);

// Route for editing delivery information
router.put('/edit-address/:addressId', authMiddleware, editDeliveryInfo);

// Set Default Address
router.put('/set-default-address', authMiddleware,setDefaultAddress);

// Route to delete an address
router.delete('/delete-address', authMiddleware, deleteAddress);

// Get delivery infos
router.get('/', authMiddleware, getDeliveryInfo);

// Fetch countries
router.get('/countries', getCountries);

// Fetch States by country
router.get('/countries/:countryCode/states',getStatesByCountry);

// Fetch cities by State
router.get('/countries/:countryCode/states/:stateCode/cities', getCitiesByState);

module.exports = router;