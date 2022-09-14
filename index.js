const express = require("express");
const app = express();
const dotenv = require("dotenv");
const winston = require("winston");
dotenv.config();

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  winston.info(`Backend server is running at port ${port}...`);
});
