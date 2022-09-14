const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running");
});
