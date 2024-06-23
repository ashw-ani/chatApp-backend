const User = require("../models/User");

exports.getUser = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(400).json({ message: "failed to find user" });
  }
};
