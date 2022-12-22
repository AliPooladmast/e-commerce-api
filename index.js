const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");
const app = express();
dotenv.config();

require("./startup/env")();
require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
const connectDB = require("./startup/db")();

const port = process.env.PORT || 5000;

connectDB.then(() => {
  app.listen(port, () => {
    winston.info(`Backend server is running at port ${port}...`);
  });
});
