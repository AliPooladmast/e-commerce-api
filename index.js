const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const error = require("./middleware/error");
require("express-async-errors");

dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use(error);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running");
});
