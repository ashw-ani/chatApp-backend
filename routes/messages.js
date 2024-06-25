const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const messageController = require("../controllers/messageController");

// GET/messages/messages
router.get("/getMessages", isAuth, messageController.getMessages);

module.exports = router;
