const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json'); // Replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;