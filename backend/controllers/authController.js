const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const validator = require('validator');
const { validationResult, body } = require('express-validator');


// Sign up logic with email confirmation
exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  // Perform validation for other fields
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
    const confirmationUrl = `${process.env.API_URL}/api/v1/auth/confirm/${confirmationToken}`;
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

// Email Confirmation
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