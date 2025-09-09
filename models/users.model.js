const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please enter your name"] 
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, "Please enter your password"],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  balance: {
    type: Number,
    required: [true, "Please enter your balance"],
    default: 0,
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailNotifications: {
    transaction: { type: Boolean, default: true },
    weeklySummary: { type: Boolean, default: true },
    budgetAlerts: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  },
  weeklyBudget: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']
  },
  lastLogin: Date,
  loginHistory: [{
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'emailVerificationToken': 1 });
userSchema.index({ 'passwordResetToken': 1 });

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;
