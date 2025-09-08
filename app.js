require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const errorhandler = require("./handlers/errorhandler");
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongo_connection);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

//models initialization
const usermodel = require("./models/users.model");
// Start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(8000, () => {
      console.log('Server is running on port 8000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

app.use(express.json());
//routes
app.use("/api/users", userRoutes);
app.use(errorhandler);

// Start the application
startServer();


