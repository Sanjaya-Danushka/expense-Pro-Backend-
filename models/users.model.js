const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter your name"] },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: { type: String, required: [true, "Please enter your password"] },
  balance: {
    type: Number,
    required: [true, "Please enter your balance"],
    default: 0,
  },
});

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;
