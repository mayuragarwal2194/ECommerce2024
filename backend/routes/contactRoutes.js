const express = require('express');
const router = express.Router();
const { sendContactForm } = require('../controllers/contactController');

// Define the route for contact form submission
router.post('/', sendContactForm);

module.exports = router;
