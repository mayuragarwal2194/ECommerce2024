const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const generateToken = require('../utils/generateToken'); // Import generateToken
const { validationResult } = require('express-validator');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your Google client ID
const jwt = require('jsonwebtoken');


// Google sign-up logic
exports.googleSignUp = async (req, res) => {
  const { token: googleToken } = req.body; // Token from Google

  console.log("Received token:", googleToken); // Log the received token

  // Perform validation for the token
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verify the token with the Google client
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
    });

    const payload = ticket.getPayload();
    console.log('Decoded payload audience:', payload.aud); // Log the audience

    const { email, name, sub: googleId, picture } = payload; // Extract user info
    console.log("Decoded payload:", { email, name, googleId, picture }); // Log decoded payload

    // Check if the user already exists in the database
    let user = await User.findOne({ email });
    console.log("User found in database:", user); // Log user found (or not)

    if (user) {
      // If the user already exists, check if they are registered via Google
      if (user.googleId) {
        // User is already registered with Google, log them in
        const jwtPayload = {
          user: {
            id: user._id,
          },
        };
        const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
          message: 'User already signed up with Google, logged in successfully',
          token: jwtToken,
        });
      } else {
        // User exists but not with Google, prompt for manual login or merge accounts
        return res.status(400).json({ message: 'Email is already registered. Please log in with your credentials.' });
      }
    }

    // If no user exists, create a new one with Google credentials
    user = new User({
      username: name, // Consider whether you want to use name or create a separate username field
      email: email,
      googleId: googleId,
      profilePicture: picture,
      isVerified: true, // Google verified the email, so we can skip manual verification
      // Do not include password here
    });

    console.log("Creating new user:", user); // Log user being created
    await user.save();
    console.log("User saved successfully:", user); // Log confirmation of user save

    // Issue a secure token
    const jwtPayload = {
      user: {
        id: user._id,
      },
    };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User signed up successfully with Google',
      token: jwtToken,
    });
  } catch (err) {
    console.error("Error in googleSignUp:", err.message); // Log error message
    res.status(500).send('Server Error');
  }
};


// Google login logic
exports.googleLogin = async (req, res) => {

  // Get the Google ID token from the request body
  const { token } = req.body;

  // Perform validation for the token
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
    });

    const payload = ticket.getPayload();

    // Extract user info from the payload
    const { email, name, picture, sub: googleId } = payload;

    // Check if the user exists in the database
    let user = await User.findOne({ email });

    if (user && !user.isVerified) {
      // If the user exists but is not verified, prompt them to verify their email
      return res.status(400).json({ message: 'Please verify your email before logging in.' });
    }

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        email,
        username: name,
        googleId,
        profilePicture: picture, // Store profile picture URL if you want
        isVerified: true, // You can set this based on your verification process
      });
      await user.save();
    }

    // Generate JWT
    const jwtPayload = {
      user: {
        id: user._id,
      },
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the JWT token back to the frontend
    res.status(200).json({ token: jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
