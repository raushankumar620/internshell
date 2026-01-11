const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  if (transporter) return transporter;

  // Email configuration from environment variables
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  // If no email credentials, use a test account (for development)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️  No email credentials found. Email notifications are disabled.');
    console.log('💡 To enable emails, add these to your .env file:');
    console.log('   EMAIL_HOST=smtp.gmail.com');
    console.log('   EMAIL_PORT=587');
    console.log('   EMAIL_USER=your-email@gmail.com');
    console.log('   EMAIL_PASSWORD=your-app-password');
    return null;
  }

  transporter = nodemailer.createTransport(emailConfig);

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email service connection failed:', error.message);
      transporter = null;
    } else {
      console.log('✅ Email service is ready to send messages');
    }
  });

  return transporter;
};

/**
 * Send contact form email to admin
 */
const sendContactFormEmail = async ({ name, email, subject, message }) => {
  const emailTransporter = createTransporter();
  
  if (!emailTransporter) {
    console.log('📧 Contact form submission (email not sent - no credentials):', { name, email, subject });
    return { 
      success: false, 
      message: 'Email service not configured, but message saved to database' 
    };
  }

  const recipientEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'support@internshell.com';

  const mailOptions = {
    from: `"InternShell Contact Form" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 15px; margin: 15px 0; 
                        border-left: 4px solid #667eea; border-radius: 4px; }
            .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .value { color: #333; }
            .message-box { background: white; padding: 20px; margin: 15px 0; 
                          border-radius: 4px; border: 1px solid #ddd; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🔔 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <p>You have received a new message from the InternShell contact form:</p>
              
              <div class="info-box">
                <div class="label">From:</div>
                <div class="value">${name}</div>
              </div>

              <div class="info-box">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>

              <div class="info-box">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>

              <div class="message-box">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
              </div>

              <div class="footer">
                <p>This email was sent from InternShell Contact Form</p>
                <p>Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Form Submission from InternShell

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Received at: ${new Date().toLocaleString()}
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('❌ Error sending contact form email:', error.message);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send email, but message saved to database'
    };
  }
};

/**
 * Send auto-reply email to contact form submitter
 */
const sendContactFormAutoReply = async ({ name, email, subject }) => {
  const emailTransporter = createTransporter();
  
  if (!emailTransporter) {
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"InternShell Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Re: ${subject} - We received your message`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 20px; margin: 20px 0; 
                          border-radius: 8px; border: 1px solid #ddd; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; 
                     padding-top: 20px; border-top: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; 
                     color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              
              <div class="message-box">
                <p>We have received your message regarding: <strong>"${subject}"</strong></p>
                <p>Our team will review your inquiry and get back to you within 24-48 business hours.</p>
              </div>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our support team will review your message</li>
                <li>We'll respond to your email address: ${email}</li>
                <li>Typical response time: 24-48 hours</li>
              </ul>

              <p style="margin-top: 20px;">In the meantime, feel free to explore:</p>
              <div style="text-align: center;">
                <a href="https://internshell.com" class="button">Visit Our Website</a>
              </div>

              <div class="footer">
                <p><strong>InternShell</strong> - Your Gateway tojobs Opportunities</p>
                <p>1-A Prem Nagar, Thana Sanganer, Jaipur - 302029</p>
                <p>Email: support@internshell.com | Phone: +91 8384935940</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${name},

Thank you for contacting InternShell!

We have received your message regarding: "${subject}"

Our team will review your inquiry and get back to you within 24-48 business hours at ${email}.

Best regards,
InternShell Team

---
InternShell - Your Gateway tojobs Opportunities
1-A Prem Nagar, Thana Sanganer, Jaipur - 302029
Email: support@internshell.com | Phone: +91 8384935940
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Auto-reply email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending auto-reply email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async ({ email, name, resetToken, resetUrl }) => {
  console.log('📧 Starting sendPasswordResetEmail...');
  console.log('📧 Params:', { email, name, resetToken, resetUrl });
  
  const emailTransporter = createTransporter();
  
  if (!emailTransporter) {
    console.log('❌ Email transporter creation failed - no credentials');
    return { success: false, message: 'Email service not configured' };
  }
  
  console.log('✅ Email transporter created successfully');

  const mailOptions = {
    from: `"InternShell" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - InternShell',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
            .code { background: #f0f0f0; padding: 15px; font-size: 24px; font-weight: bold; 
                   letter-spacing: 5px; text-align: center; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password for your InternShell account.</p>
              
              <div class="code">${resetToken}</div>
              
              <p>Enter this code on the password reset page, or click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ This code will expire in 1 hour.</strong>
              </div>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <div class="footer">
                <p><strong>InternShell</strong> - Your Gateway to Internship Opportunities</p>
                <p>Email: support@internshell.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${name},

We received a request to reset your password for your InternShell account.

Your password reset code is: ${resetToken}

This code will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
InternShell Team
    `
  };

  try {
    console.log('📧 Attempting to send password reset email to:', email);
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully!');
    console.log('✅ Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactFormEmail,
  sendContactFormAutoReply,
  sendPasswordResetEmail,
  sendVerificationEmail: async ({ email, name, verificationToken, verificationUrl }) => {
    console.log('📧 Starting sendVerificationEmail...');
    console.log('📧 Params:', { email, name, verificationToken, verificationUrl });
    console.log('📧 Email credentials check:', {
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'SET (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'NOT SET',
      EMAIL_HOST: process.env.EMAIL_HOST || 'NOT SET',
      EMAIL_PORT: process.env.EMAIL_PORT || 'NOT SET'
    });
    
    const emailTransporter = createTransporter();
    
    if (!emailTransporter) {
      console.log('❌ Email transporter creation failed - no credentials');
      return { success: false, message: 'Email service not configured' };
    }
    
    console.log('✅ Email transporter created successfully');

    const mailOptions = {
      from: `"InternShell" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - InternShell',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
              .code { background: #f0f0f0; padding: 15px; font-size: 24px; font-weight: bold; 
                     letter-spacing: 5px; text-align: center; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Welcome to InternShell!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for registering with InternShell. Please verify your email address to complete your registration.</p>
                
                <div class="code">${verificationToken}</div>
                
                <p>Enter this code on the verification page, or click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email</a>
                </div>
                
                <p><strong>This code will expire in 24 hours.</strong></p>
                
                <p>If you didn't create an account with InternShell, you can safely ignore this email.</p>
                
                <div class="footer">
                  <p><strong>InternShell</strong> - Your Gateway to Internship Opportunities</p>
                  <p>Email: support@internshell.com</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hi ${name},

Welcome to InternShell!

Your email verification code is: ${verificationToken}

This code will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
InternShell Team
      `
    };

    try {
      console.log('📧 Attempting to send email to:', email);
      const info = await emailTransporter.sendMail(mailOptions);
      console.log('✅ Verification email sent successfully!');
      console.log('✅ Message ID:', info.messageId);
      console.log('✅ Response:', info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error command:', error.command);
      return { success: false, error: error.message };
    }
  }
};
