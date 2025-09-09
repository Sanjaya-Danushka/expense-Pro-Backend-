const cron = require('node-cron');
const Transaction = require('../models/transactions.model');
const User = require('../models/users.model');
const emailService = require('./emailService');

class Scheduler {
  constructor() {
    this.scheduleWeeklySummaries();
  }

  async sendWeeklySummaryToUser(user) {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const transactions = await Transaction.find({
        user: user._id,
        date: { $gte: oneWeekAgo }
      });

      const categoryTotals = {};
      let total = 0;

      transactions.forEach(transaction => {
        const category = transaction.category || 'Uncategorized';
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
        total += transaction.amount;
      });

      const weeklyBudget = user.weeklyBudget || 0;
      const savings = weeklyBudget - total;

      await emailService.sendWeeklySummary(user, {
        startDate: oneWeekAgo,
        endDate: new Date(),
        categoryTotals,
        total,
        savings
      });
    } catch (error) {
      console.error(`Error sending weekly summary to ${user.email}:`, error);
    }
  }

  async sendWeeklySummaries() {
    try {
      const users = await User.find({ emailNotifications: true });
      
      for (const user of users) {
        await this.sendWeeklySummaryToUser(user);
      }
    } catch (error) {
      console.error('Error in weekly summary scheduler:', error);
    }
  }

  scheduleWeeklySummaries() {
    // Schedule to run every Sunday at 9 AM
    cron.schedule('0 9 * * 0', () => {
      console.log('Running weekly summary job...');
      this.sendWeeklySummaries();
    });
    
    console.log('Weekly summary scheduler initialized');
  }
}

module.exports = new Scheduler();
