const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Server is ready to take our messages');
    } catch (error) {
      console.error('❌ Email server connection error:', error);
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to connect to email server');
      } else {
        console.warn('⚠️  Email service not configured. Emails will not be sent in development unless configured.');
      }
    }
  }

  async sendEmail(to, subject, template, data) {
    // Don't send emails in test environment
    if (process.env.NODE_ENV === 'test') {
      console.log(`[Test Mode] Email would be sent to: ${to}, Subject: ${subject}`);
      return;
    }

    // Don't send emails in development unless explicitly enabled
    if (process.env.NODE_ENV !== 'production' && process.env.SEND_EMAILS !== 'true') {
      console.log(`[Dev Mode] Email would be sent to: ${to}, Subject: ${subject}`);
      console.log('To enable email sending in development, set SEND_EMAILS=true in .env');
      return;
    }

    try {
      const templatePath = path.join(__dirname, '../views/emails', `${template}.ejs`);
      const html = await ejs.renderFile(templatePath, {
        ...data,
        appName: 'Expense Tracker',
        currentYear: new Date().getFullYear(),
        supportEmail: 'support@expensetracker.com'
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Expense Tracker" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject: `[Expense Tracker] ${subject}`,
        html,
        // Add DKIM signing if needed
        dkim: process.env.DKIM_PRIVATE_KEY ? {
          domainName: process.env.DOMAIN_NAME,
          keySelector: process.env.DKIM_SELECTOR || 'default',
          privateKey: process.env.DKIM_PRIVATE_KEY
        } : undefined
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent to ${to} with message ID: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendTransactionNotification(user, transaction) {
    await this.sendEmail(
      user.email,
      'New Transaction Added',
      'transaction-notification',
      { user, transaction }
    );
  }

  async sendWeeklySummary(user, summary) {
    await this.sendEmail(
      user.email,
      'Your Weekly Expense Summary',
      'weekly-summary',
      { user, ...summary }
    );
  }

  async sendBudgetAlert(user, category, amount, budget) {
    await this.sendEmail(
      user.email,
      `Budget Alert: ${category} Limit Exceeded`,
      'budget-alert',
      { user, category, amount, budget }
    );
  }

  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await this.sendEmail(
      user.email,
      'Password Reset Request',
      'password-reset',
      { user, resetUrl }
    );
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await this.sendEmail(
      user.email,
      'Verify Your Email',
      'email-verification',
      { user, verificationUrl }
    );
  }
}

module.exports = new EmailService();
