const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(express.json());

app.use(authRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(app.listen(PORT))
  .catch((error) => {
    console.log("database connection error");
  });
