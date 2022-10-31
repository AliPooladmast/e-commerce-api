const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => winston.info("Backend server is connected to DB"))
    .catch((err) => winston.error(err));
};
