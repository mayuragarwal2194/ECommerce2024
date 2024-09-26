const express = require('express');
const router = express.Router();
const {
  signUp,
  confirmEmail,
  login,
  validateLogin
} = require('../controllers/authController');
const { uploadNone } = require('../config/multerConfig');
const { authMiddleware } = require('../middleware/authMiddleware');



// User registration (signup) route
router.post('/signup', uploadNone, signUp);

// Email confirmation route
router.get('/confirm/:token', confirmEmail);

// Login route with validation
router.post('/login', validateLogin, login);

router.get('/protected-route', authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome, user ID: ${req.user.id}` });
});

module.exports = router;