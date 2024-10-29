const express = require('express');
const router = express.Router();
const { googleSignUp, googleLogin } = require('../controllers/googleController');

router.post('/google-signup', googleSignUp);
router.post('/google-login', googleLogin);

module.exports = router;
