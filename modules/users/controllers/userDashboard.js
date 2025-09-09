const userDashboard = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User dashboard"
    });
};

module.exports = userDashboard;
