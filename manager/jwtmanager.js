const jwt = require("jsonwebtoken");

const jwtManager = (user) => {
    try {
        if (!user || !user._id) {
            throw new Error('Invalid user object provided to jwtManager');
        }
        
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            { 
                id: user._id.toString(), // Ensure _id is a string
                email: user.email       // Include email for additional verification
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '24h' 
            }
        );
        
        return token;
    } catch (error) {
        console.error('Error in jwtManager:', error);
        throw error; // Re-throw to be handled by the calling function
    }
};

module.exports = jwtManager;
