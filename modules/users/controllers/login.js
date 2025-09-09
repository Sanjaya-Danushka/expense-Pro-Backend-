const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        // Remove password from the response
        const userResponse = user.toObject();
        delete userResponse.password;

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
