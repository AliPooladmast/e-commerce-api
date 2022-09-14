const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running");
});
