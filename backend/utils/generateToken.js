const crypto = require('crypto');

/**
 * Generates a secure token and returns it along with its expiry time.
 *
 * @param {number} tokenLength - The length of the generated token (default: 40 chars).
 * @param {number} expiryDuration - The duration in milliseconds after which the token will expire (default: 1 hour).
 * @returns {{ token: string, expiry: Date }} - Returns the generated token and its expiry date.
 */
const generateToken = (tokenLength = 20, expiryDuration = 3600000) => {
  const token = crypto.randomBytes(tokenLength).toString('hex'); // Generate random token
  const expiry = Date.now() + expiryDuration; // Set token expiry time
  
  return {
    token,
    expiry: new Date(expiry) // Convert expiry to Date object
  };
};

module.exports = generateToken;
