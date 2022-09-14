const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  const { transports, createLogger, format } = winston;
  const { combine, json, colorize, prettyPrint } = format;

  const logger = createLogger({
    level: "info",
    format: combine(json(), colorize(), prettyPrint()),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "info.log", level: "info" }),
    ],
    exceptionHandlers: [
      new transports.File({ filename: "uncaughtExceptions.log" }),
      new transports.Console(),
    ],
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
