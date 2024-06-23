const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

// const userController = require("../controllers/user");
// GET/user/getUser
router.get("/getUser", isAuth, userController.getUser);

module.exports = router;
