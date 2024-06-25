const Message = require("../models/Message");

exports.getMessages = async (req, res, next) => {
  const sender = req.userId;
  recipient = req.query.recipient;
  try {
    const messages = await Message.find({
      sender: { $in: [sender, recipient] },
      recipient: { $in: [sender, recipient] },
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: "failed to fetch messages" });
  }
};
