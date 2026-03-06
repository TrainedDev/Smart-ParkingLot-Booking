const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const userRoute = require("./routes/userRoutes");
const parkingLotRoute = require("./routes/parkingLotRoute");
const bookingRoute = require("./routes/bookingRoute");
const { globalErrorHandler } = require("./middleware/handler");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", userRoute);
app.use("/parking-lot", parkingLotRoute);
app.use("/booking", bookingRoute);

app.use(globalErrorHandler);
app.get("/", (req, res) => console.log("server is Live"));

sequelize
  .authenticate()
  .then(() => console.log("database connected"))
  .catch((error) => console.log("failed to connect database", error));

module.exports = app;
