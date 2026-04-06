const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const transactionRouter = require("./routes/transaction.route");
const dashboardRouter = require("./routes/dashboard.route");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/transactions", transactionRouter);
app.use("/dashboard", dashboardRouter);


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