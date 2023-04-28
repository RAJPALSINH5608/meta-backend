require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
//Routers
const authRouter = require("./routes/auth");
const detailsRouter = require("./routes/details");
const tilesRouter = require("./routes/tilesRoute");
const marketRouter = require("./routes/marketRoute");
const Admin = require('./routes/adminroute')
// app.use("/api/v1/landDetail" , landType);
const leadershipboardRouter = require("./routes/leadershipboard");
const port = process.env.PORT || 2411;
const authenticationMiddleware = require("./middleware/auth");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/v1/tiledetail", authenticationMiddleware, tilesRouter);
app.use("/api/v1/auth/account", authRouter);
app.use("/api/v1/auth/details", authenticationMiddleware, detailsRouter);
app.use("/api/v1/marketplace", marketRouter);
app.use("/api/v1/leadershipboard", leadershipboardRouter);
app.use("/api/v1/admin" , Admin);
app.get("/", (req, res) => {
  res.status(200).json("working HomePage");
});

const start = async () => {
  try {
    try {
      connectDB(process.env.URL);
      console.log("Connected to DB Successfully");
    } catch (error) {
      console.log(error);
    }
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
