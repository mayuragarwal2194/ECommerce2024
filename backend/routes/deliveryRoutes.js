// routes/deliveryRoutes.js
const express = require('express');
const { saveDeliveryInfo, getCountries, getStatesByCountry, getCitiesByState, getDeliveryInfo } = require('../controllers/deliveryController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware to protect routes

const router = express.Router();

// Save delivery infos
router.post('/', authMiddleware, saveDeliveryInfo);

// Get delivery infos
router.get('/', authMiddleware, getDeliveryInfo);

// Fetch countries
router.get('/countries', getCountries);

// Fetch States by country
router.get('/countries/:countryCode/states',getStatesByCountry);

// Fetch cities by State
router.get('/countries/:countryCode/states/:stateCode/cities', getCitiesByState);

module.exports = router;