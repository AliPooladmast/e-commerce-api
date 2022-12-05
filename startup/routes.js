const express = require("express");
const authRoute = require("../routes/auth");
const userRoute = require("../routes/user");
const productRoute = require("../routes/product");
const orderRoute = require("../routes/order");
const stripeRoute = require("../routes/stripe");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/products", productRoute);
  app.use("/api/orders", orderRoute);
  app.use("/api/checkout", stripeRoute);
  app.use(error);
};
