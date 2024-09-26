const User = require('../models/user');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// Password reset request controller
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a token with a 1-hour expiry
    const { token, expiry } = generateToken(20, 3600000);

    user.passwordResetToken = token;
    user.passwordResetExpiry = expiry;

    await user.save();

    const resetUrl = `${process.env.API_URL}/api/v1/user/password-reset/${token}`;
    const emailText = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    await sendEmail(user.email, 'Password Reset', emailText);

    return res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error requesting password reset', error });
  }
};

// Password reset handler
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
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

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token and expiry
    user.passwordResetToken = '';
    user.passwordResetExpiry = null;

    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password', error });
  }
};