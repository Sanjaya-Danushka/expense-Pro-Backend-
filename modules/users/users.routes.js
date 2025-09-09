const express = require('express');
const userRoutes = express.Router();
const register = require("./controllers/register");
const login = require("./controllers/login");
const userDashboard = require("./controllers/userDashboard");
const auth = require("../../middleware/auth");

// Public routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);

// Protected routes (require authentication)
userRoutes.use(auth);
userRoutes.get("/dashboard", userDashboard);

module.exports = userRoutes;
