# Expense Tracker Application

A full-stack expense tracking application built with Node.js, Express, MongoDB, and modern JavaScript. This application helps users track their expenses, set budgets, and receive email notifications.

## Features

- User authentication (register/login)
- Email verification
- Password reset functionality
- Transaction management (add, view, update, delete)
- Weekly expense summaries via email
- Budget tracking and alerts
- Responsive design

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email**: Nodemailer with EJS templates
- **Scheduling**: node-cron for scheduled emails
- **Environment Management**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server
PORT=8000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email (for production)
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email@example.com

# Client URL (for email links)
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/verify-email/:token` - Verify email address
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password/:token` - Reset password

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a single transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Email Features

- Email verification on signup
- Password reset functionality
- Weekly expense summaries
- Budget alerts
- Transaction notifications

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. For email testing in development, emails are logged to the console by default.

## Production Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Configure a real SMTP server for emails
3. Make sure to set up proper security measures (HTTPS, CORS, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License 

## Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Nodemailer](https://nodemailer.com/)
- [JWT](https://jwt.io/)
