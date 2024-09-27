const express = require('express');
const router = express.Router();
const { uploadMiddleware, handleMulterError } = require('../config/multerConfig');
const { getUserProfile, editUser, updateProfilePicture } = require('../controllers/userProfileController');
const { authMiddleware } = require('../middleware/authMiddleware');



router.get('/profile', authMiddleware, getUserProfile);

// PUT request to edit user details (username and email)
router.put('/edit', authMiddleware, editUser);

// Route to upload/update profile picture
router.put('/profile-picture', authMiddleware, uploadMiddleware, handleMulterError, updateProfilePicture);

module.exports = router;