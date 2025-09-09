const Transaction = require("../../models/transactions.model");
const User = require("../../models/users.model");

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { amount, category, remarks, transaction_type } = req.body;
        
        // Validate transaction type
        if (!['income', 'expense'].includes(transaction_type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transaction type. Must be either "income" or "expense"'
            });
        }

        // Create transaction
        const transaction = new Transaction({
            user_id: req.user.id,
            amount,
            category,
            remarks,
            transaction_type
        });

        await transaction.save();

        // Update user's balance
        await updateUserBalance(req.user.id, amount, transaction_type);

        res.status(201).json({
            success: true,
            data: transaction,
            message: 'Transaction created successfully'
        });

    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all transactions for the authenticated user
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Get transaction by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const { amount, category, remarks, transaction_type } = req.body;
        
        // Find the transaction
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Store old amount for balance adjustment
        const oldAmount = transaction.amount;
        const oldType = transaction.transaction_type;

        // Update transaction
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.remarks = remarks || transaction.remarks;
        transaction.transaction_type = transaction_type || transaction.transaction_type;

        await transaction.save();

        // Revert old transaction's effect on balance
        await updateUserBalance(req.user.id, -oldAmount, oldType);
        // Apply new transaction's effect on balance
        await updateUserBalance(req.user.id, transaction.amount, transaction.transaction_type);

        res.status(200).json({
            success: true,
            data: transaction,
            message: 'Transaction updated successfully'
        });

    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Revert transaction's effect on balance
        await updateUserBalance(
            req.user.id, 
            -transaction.amount, 
            transaction.transaction_type
        );

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });

    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Helper function to update user balance
const updateUserBalance = async (userId, amount, transactionType) => {
    const user = await User.findById(userId);
    if (!user) return;

    if (transactionType === 'income') {
        user.balance += amount;
    } else {
        user.balance -= amount;
    }

    await user.save();
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
