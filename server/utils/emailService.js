const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Sends an email notification using Gmail SMTP
 * @param {Object} options - Email options (to, subject, html)
 */
const sendEmailNotification = async (options) => {
  try {
    // 1. Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail as the service
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: options.to,               // Recipient address (admin)
      subject: options.subject,     // Subject line
      html: options.html,           // HTML body
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent successfully: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email notification:', error.message);
    return false; // Return false so the app doesn't crash
  }
};

module.exports = sendEmailNotification;
