const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');


// Profile
exports.getUserProfile = async (req, res) => {
  try {
    // Assume that the user's ID is sent in the request (e.g., from the token)
    const userId = req.user.id; // Adjust this based on how you set up authentication

    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Exclude the password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to edit user details (username and email)
exports.editUser = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;  // Assuming the user ID comes from the JWT

  try {
    const user = await User.findById(userId);  // Fetch user by ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldEmail = user.email; // Store the old email

    // Check if email has changed
    if (email && email !== oldEmail) {
      // Temporarily update email and mark as unverified
      user.email = email;
      user.isVerified = false;

      // Generate a new confirmation token with 1-hour expiry
      const { token: confirmationToken, expiry } = generateToken(20, 3600000);

      user.confirmationToken = confirmationToken;  // Save new token
      user.tokenExpiry = expiry;  // Save token expiry time

      // Save the user with updated email and unverified status
      await user.save();

      // Send confirmation email to the new email address
      const confirmationUrl = `${process.env.API_URL}/api/v1/auth/confirm/${confirmationToken}`;
      const emailTextNew = `Please confirm your new email by clicking the link: ${confirmationUrl}`;
      await sendEmail(user.email, 'Email Confirmation', emailTextNew);

      // Notify the user on the old email address about the change
      const emailTextOld = `Your email was changed to ${email}. If this wasn't you, please contact support.`;
      await sendEmail(oldEmail, 'Email Change Notification', emailTextOld);

      return res.status(200).json({
        message: 'User updated. Please verify your new email address. A notification has also been sent to your old email.',
      });
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Save any other changes
    await user.save();

    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user details', error });
  }
};

