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

//Upadate Cart
router.put("/:id", verifyTokenAutorize, async (req, res) => {
  updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedCart);
});

//Delete Cart
router.delete("/:id", verifyTokenAutorize, async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json("cart has been deleted...");
});

module.exports = router;
