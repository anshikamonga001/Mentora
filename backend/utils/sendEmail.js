import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // If email credentials are not set up or are using the default placeholder,
  // we bypass actual SMTP sending so the frontend doesn't throw an error.
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log('====================================================');
    console.log(`📧 MOCK EMAIL SENT TO: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log('(To send real emails, update EMAIL_USER and EMAIL_PASS in your .env)');
    console.log('====================================================');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Mentora Team'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};
