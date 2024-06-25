const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user.js");
const messageRoutes = require("./routes/messages.js");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const url = require("url");
const Message = require("./models/Message.js");

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    const server = app.listen(PORT);

    const wss = new ws.WebSocketServer({ server });

    wss.on("connection", (socket, req) => {
      // using the jwt token that is sent from the connection itself as there is no cookie saved
      const parameters = url.parse(req.url, true);
      const token = parameters.query.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;
          const username = decoded.username;
          socket.userId = userId;
          socket.username = username;
          // notifying about new connection
          [...wss.clients].forEach((client) => {
            client.send(
              JSON.stringify({
                online: [...wss.clients].map((c) => ({
                  userId: c.userId,
                  username: c.username,
                })),
              })
            );
          });
        } catch (error) {
          console.error("JWT verification failed", error);
        }
      }
      socket.on("message", async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;
        if (recipient && text) {
          const messageDoc = await Message.create({
            sender: socket.userId,
            recipient,
            text,
          });
          [...wss.clients]
            .filter((c) => c.userId === recipient)
            .forEach((c) =>
              c.send(
                JSON.stringify({
                  text: text,
                  sender: socket.userId,
                  _id: messageDoc._id,
                  recipient,
                })
              )
            );
        }
      });
    });
  })
  .catch((error) => {
    console.log("database connection error");
  });
// .map((client) => client.username)
