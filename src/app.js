const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
  .then(() => {
    console.log("Connection is established");
    app.listen(3500, () => {
      console.log("Server is running on port 3500");
    });
  })
  .catch((err) => {
    console.error("Database is not connected:", err.message);
  });
