const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword } = require('../controllers/passwordController');


// Password reset request route
router.post('/password-reset-request', requestPasswordReset);

// Password reset route
router.post('/password-reset/:token', resetPassword);

module.exports = router;