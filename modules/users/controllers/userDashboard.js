const mongoose = require("mongoose");

const userDashboard = async (req, res) => {
  const User = mongoose.model("user");
  const user = await User.findOne({ _id: req.user.id }).select("name balance email");
  res.status(200).json({
    success: true,
    message: "User dashboard",
    data:{
      user,
      dashboard:{
        expenses:user.expenses,
        income:user.income
      }
    }
  });
};

module.exports = userDashboard;
