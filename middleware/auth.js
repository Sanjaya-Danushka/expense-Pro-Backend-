
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: 'No authorization token provided'
            });
        }

        // Extract token
        const token = req.headers.authorization.replace("Bearer ", "");
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please log in again.',
                error: 'Token expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                error: 'Invalid token'
            });
        }
        
        // For any other errors
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = auth;
