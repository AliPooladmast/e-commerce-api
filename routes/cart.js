const {
  verifyTokenAutorize,
  verifyTokenAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");

//Create Cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  const savedCart = await newCart.save();
  res.json(savedCart);
});

module.exports = router;
