const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");
const app = express();
dotenv.config();

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/env")();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  winston.info(`Backend server is running at port ${port}...`);
});
