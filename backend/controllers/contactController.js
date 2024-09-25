const nodemailer = require('nodemailer');
const Contact = require('../models/contact'); // Import the model

// Controller function to handle contact form submission
const sendContactForm = async (req, res) => {
  const { username, email, message } = req.body;

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail account
      pass: process.env.GMAIL_PASS, // Your Gmail app password
    },
  });

  // Define the email options for the site owner
  const siteOwnerMailOptions = {
    from: email, // sender address
    to: process.env.GMAIL_USER, // receiver email (your own Gmail account)
    subject: `Contact Form Submission from ${username}`,
    text: `
      Username: ${username}
      Email: ${email}

      Message:
      ${message}
    `,
  };

  // Define the email options for the user
  const userMailOptions = {
    from: process.env.GMAIL_USER, // sender address
    to: email, // receiver email (the user’s email address)
    subject: `We received your message, ${username}!`,
    text: `
      Hi ${username},

      Thank you for reaching out! We have received your message and will get back to you shortly.

      Your Message:
      ${message}

      Regards,
      ${process.env.COMPANY_NAME}
    `,
  };

  try {
    // Save to the database
    const newContact = new Contact({
      username,
      email,
      message
    });
    await newContact.save();

    // Send the email to the site owner
    await transporter.sendMail(siteOwnerMailOptions);

    // Send a confirmation email to the user
    await transporter.sendMail(userMailOptions);

    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).send('Error processing contact form');
  }
};

module.exports = { sendContactForm };
