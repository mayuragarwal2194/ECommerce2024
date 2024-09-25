const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// Sign up logic with email confirmation
exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  // Perform validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user instance
    user = new User({ username, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate email confirmation token (assuming user model has this method)
    const confirmationToken = user.generateConfirmationToken();

    // Save the user (with unverified email and token)
    await user.save();

    // Prepare email content
    const confirmationUrl = `${process.env.API_URL}/api/v1/user/confirm/${confirmationToken}`;
    const emailText = `Please confirm your email by clicking the link: ${confirmationUrl}`;

    // Send confirmation email
    await sendEmail(user.email, 'Email Confirmation', emailText);

    res.status(201).json({
      message: 'User registered successfully, please confirm your email.',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;
  console.log('Received token:', token); // Log received token

  try {
    // Find user by confirmation token and ensure the token hasn't expired
    const user = await User.findOne({
      confirmationToken: token,
      tokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.log('No user found or token has expired');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Activate user account
    user.isVerified = true;
    user.confirmationToken = ''; // Clear the token
    user.tokenExpiry = undefined; // Remove token expiry
    await user.save();

    console.log('User email confirmed:', user.email); // Log success
    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (err) {
    console.error('Error during email confirmation:', err.message);
    res.status(500).send('Server Error');
  }
};

// Validation middleware for login
exports.validateLogin = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
];

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Perform validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email has changed
    if (email && email !== user.email) {
      // Temporarily store new email, but mark as unverified
      user.email = email;
      user.isVerified = false;

      // Generate email confirmation token
      const confirmationToken = user.generateConfirmationToken();

      // Save changes (including unverified email)
      await user.save();

      // Send email confirmation link
      const confirmationUrl = `${process.env.API_URL}/api/v1/user/confirm/${confirmationToken}`;
      const emailText = `Please confirm your new email by clicking the link: ${confirmationUrl}`;

      await sendEmail(user.email, 'Email Confirmation', emailText);

      return res.status(200).json({
        message: 'User updated. Please verify your new email address.',
      });
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Save changes
    await user.save();

    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user details', error });
  }
};


