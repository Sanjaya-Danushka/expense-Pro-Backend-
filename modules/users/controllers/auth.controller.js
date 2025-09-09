const User = require('../../../models/users.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../../../services/emailService');

class AuthController {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Generate random token for email verification and password reset
  generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email
  async sendVerificationEmail(user) {
    try {
      const verificationToken = this.generateRandomToken();
      const verificationExpires = new Date();
      verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours expiry

      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = verificationExpires;
      await user.save();

      await emailService.sendVerificationEmail(user, verificationToken);
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        return { success: false, message: 'Invalid or expired token' };
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new Error('Failed to verify email');
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { success: true, message: 'If your email exists, you will receive a password reset link' };
      }

      const resetToken = this.generateRandomToken();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      await emailService.sendPasswordReset(user, resetToken);
      return { success: true, message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw new Error('Failed to process password reset request');
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        return { success: false, message: 'Invalid or expired token' };
      }

      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Failed to reset password');
    }
  }

  // Update user preferences
  async updatePreferences(userId, preferences) {
    try {
      const allowedUpdates = {
        'emailNotifications.transaction': preferences.emailNotifications?.transaction,
        'emailNotifications.weeklySummary': preferences.emailNotifications?.weeklySummary,
        'emailNotifications.budgetAlerts': preferences.emailNotifications?.budgetAlerts,
        'emailNotifications.promotions': preferences.emailNotifications?.promotions,
        weeklyBudget: preferences.weeklyBudget,
        currency: preferences.currency
      };

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        data: {
          emailNotifications: user.emailNotifications,
          weeklyBudget: user.weeklyBudget,
          currency: user.currency
        }
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }
}

module.exports = new AuthController();
