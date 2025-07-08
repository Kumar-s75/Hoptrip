const nodemailer = require('nodemailer');

const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER || process.env.EXPO_PUBLIC_EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.EXPO_PUBLIC_EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('Email credentials not provided. Email functionality will be limited.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = createEmailTransporter();
  
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || process.env.EXPO_PUBLIC_EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const generateInvitationEmail = (senderName, tripName, joinUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trip Invitation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4B61D1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #4B61D1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 Trip Invitation</h1>
        </div>
        <div class="content">
          <h2>Hello!</h2>
          <p><strong>${senderName}</strong> has invited you to join their trip "<strong>${tripName}</strong>".</p>
          <p>Join the trip to start planning together, share expenses, and create amazing memories!</p>
          <div style="text-align: center;">
            <a href="${joinUrl}" class="button">Join Trip</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 4px;">${joinUrl}</p>
        </div>
        <div class="footer">
          <p>Happy travels!<br>The HopTrip Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  createEmailTransporter,
  sendEmail,
  generateInvitationEmail
};