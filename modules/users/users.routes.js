const express = require('express');
const userRoutes = express.Router();
const register = require("./controllers/register");
const login = require("./controllers/login");
const userDashboard = require("./controllers/userDashboard");
const authController = require("./controllers/auth.controller");
const auth = require("../../middleware/auth");

// Public routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);

// Email verification
userRoutes.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const result = await authController.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Password reset
userRoutes.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authController.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

userRoutes.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authController.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Protected routes (require authentication)
userRoutes.use(auth);

// User dashboard
userRoutes.get("/dashboard", userDashboard);

// User preferences
userRoutes.put("/preferences", async (req, res) => {
  try {
    const { preferences } = req.body;
    const result = await authController.updatePreferences(req.user._id, preferences);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Resend verification email
userRoutes.post("/resend-verification", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }
    const result = await authController.sendVerificationEmail(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = userRoutes;
