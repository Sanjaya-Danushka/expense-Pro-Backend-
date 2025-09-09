const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwtManager = require("../../../manager/jwtmanager");

const login = async (req, res) => {
    try {
        const UserModel = mongoose.model("user");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await UserModel.findOne({ email: email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

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
        
        return res.status(200).json({ 
            success: true,
            data: userResponse,
            token,
            message: "Login successful" 
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = login
