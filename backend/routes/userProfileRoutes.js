const express = require('express');
const router = express.Router();
const { getUserProfile, editUser } = require('../controllers/userProfileController');
const { authMiddleware } = require('../middleware/authMiddleware');



router.get('/profile', authMiddleware, getUserProfile);

// PUT request to edit user details (username and email)
router.put('/edit', authMiddleware, editUser);

module.exports = router;