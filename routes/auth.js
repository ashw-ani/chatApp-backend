const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controllers/authController");

// POST /signup
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

router.post("/login", authController.login);

module.exports = router;
