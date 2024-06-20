const User = require("../models/User");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

exports.signup = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "user created successully" });
  } catch {
    res.status(500).json({ message: "failed to create user" });
  }
};
