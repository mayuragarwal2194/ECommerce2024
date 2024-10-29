const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');
const rateLimit = require('express-rate-limit');

// Create a rate limiter for password reset requests
exports.passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many password reset requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Password reset request controller
exports.requestPasswordReset = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the token

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({ message: 'Password reset link sent to your email if it exists.' });
    }

    // Generate a token with a 1-hour expiry
    const { token, expiry } = generateToken(20, 3600000);
    
    user.passwordResetToken = token;
    user.passwordResetExpiry = expiry;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/password-reset/${token}`;
    const emailText = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    await sendEmail(user.email, 'Password Reset', emailText);

    return res.status(200).json({ message: 'Password reset link sent to your email if it exists.' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ message: 'Error requesting password reset', error });
  }
};


// Password reset handler
exports.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    // Find user by reset token and ensure token is still valid
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: Date.now() },  // Token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check password strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({
        message: 'Password is not strong enough. It should be at least 8 characters long, and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.'
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'Password already used. Please choose a new password.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token and expiry
    user.passwordResetToken = '';
    user.passwordResetExpiry = null;

    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Error resetting password', error });
  }
};

