const {
  verifyTokenAutorize,
  verifyTokenAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Order = require("../models/Order");

//Create Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  const savedOrder = await newOrder.save();
  res.json(savedOrder);
});

module.exports = router;
