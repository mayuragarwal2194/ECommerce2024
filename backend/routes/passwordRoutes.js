const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword, passwordResetLimiter } = require('../controllers/passwordController');
const { authMiddleware } = require('../middleware/authMiddleware');


// Password reset request route
router.post('/password-reset-request',passwordResetLimiter, authMiddleware, requestPasswordReset);

// Password reset route
router.post('/password-reset/:token', resetPassword);

module.exports = router;