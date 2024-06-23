const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user.js");
const ws = require("ws");
const jwt = require("jsonwebtoken");

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

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    const server = app.listen(PORT);

    const wss = new ws.WebSocketServer({ server });

    wss.on("connection", (socket, req) => {
      socket.on("message", async (message) => {
        const { connection, token } = await JSON.parse(message);
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;
          const username = decoded.username;
          socket.userId = userId;
          socket.username = username;
          // console.log([...wss.clients].map((client) => client.username));
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
      });
    });
  })
  .catch((error) => {
    console.log("database connection error");
  });
// .map((client) => client.username)
