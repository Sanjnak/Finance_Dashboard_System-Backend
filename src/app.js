const express = require("express");
const connectDB = require("./config/database");

require("dotenv").config();
const app = express();

app.use(express.json());

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database not connected:", err.message);
  });