# Email Features in Expense Tracker

This document outlines the email functionality implemented in the Expense Tracker application.

## Features

1. **Email Verification**
   - New users receive a verification email upon registration
   - Email contains a secure link to verify their email address
   - 24-hour expiration on verification links

2. **Password Reset**
   - Users can request a password reset
   - Secure, time-limited reset link sent via email
   - One-time use tokens for security

3. **Transaction Notifications**
   - Real-time email alerts for new transactions
   - Includes transaction details and security notice

4. **Weekly Expense Summaries**
   - Automated weekly reports sent every Sunday at 9 AM
   - Breakdown of expenses by category
   - Comparison with weekly budget
   - Savings/excess spending analysis

5. **Budget Alerts**
   - Notifications when spending exceeds budget in a category
   - Visual indicators of budget status

## Email Templates

All email templates are located in `views/emails/`:

- `transaction-notification.ejs` - New transaction alerts
- `weekly-summary.ejs` - Weekly expense reports
- `budget-alert.ejs` - Budget limit notifications
- `email-verification.ejs` - Email verification
- `password-reset.ejs` - Password reset instructions

## Configuration

1. **Environment Variables**
   Update your `.env` file with email settings:
   ```
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-email-app-password
   EMAIL_FROM=Expense Tracker <noreply@yourapp.com>
   CLIENT_URL=http://localhost:3000
   ```

2. **Gmail Setup**
   - For Gmail, use an App Password if 2FA is enabled
   - Go to Google Account > Security > App passwords
   - Generate a new app password for your application

3. **Development Mode**
   - In development, emails are logged to console by default
   - Set `SEND_EMAILS=true` in `.env` to send real emails

## Security Considerations

- Email verification required for account activation
- Password reset tokens expire after 1 hour
- Rate limiting on email endpoints
- Secure email transport with TLS
- DKIM signing support for production

## Testing

1. **Unit Tests**
   ```bash
   npm test
   ```

2. **Manual Testing**
   - In development, check console logs for email content
   - Use tools like Mailtrap for testing in development

## Troubleshooting

- **Emails not sending**: Check SMTP settings and credentials
- **Emails going to spam**: Verify SPF, DKIM, and DMARC records
- **Connection issues**: Check firewall and port settings

## Future Enhancements

- Customizable email templates
- Email digest preferences
- More detailed analytics in weekly reports
- Mobile push notifications
- Support for multiple email providers

## Dependencies

- nodemailer: ^6.9.1
- ejs: ^3.1.9
- node-cron: ^3.0.2
