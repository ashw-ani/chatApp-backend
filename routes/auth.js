const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const authController = require("../controllers/authController");

// POST /auth/signup
router.put(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.signup
);

// POST/auth/login
router.post("/login", authController.login);

module.exports = router;
