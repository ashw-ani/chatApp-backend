const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /signup
router.post("/signup", authController.signup);
router.get("/login", (req, res, next) => {
  res.status(200).json({ message: "some message" });
});

module.exports = router;
