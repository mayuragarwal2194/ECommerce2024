const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contactSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
