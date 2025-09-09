const User = require("../../../models/users.model");
const bcrypt = require('bcryptjs');
const jwtManager = require("../../../manager/jwtmanager");

const register = async (req, res) => {
    try {
        const { email, password, name, balance = 0 } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            balance
        });

        // Create a clean user object for the response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // Generate JWT token
        const token = jwtManager(userResponse);

        res.status(201).json({
            success: true,
            data: userResponse,
            token,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = register;
