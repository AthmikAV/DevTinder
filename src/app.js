const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
const cors = require('cors');
require("dotenv").config()
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
const PORT = process.env.PORT || 3500;
connectDB()
  .then(() => {
    console.log("Connection is established");
    app.listen(PORT, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.error("Database is not connected:", err.message);
  });
