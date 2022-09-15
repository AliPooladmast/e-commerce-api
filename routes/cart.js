const {
  verifyTokenAutorize,
  verifyTokenAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");
const validateObjectId = require("../middleware/validateObjectId");

//Create Cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  const savedCart = await newCart.save();
  res.json(savedCart);
});

//Upadate Cart
router.put(
  "/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedCart);
  }
);

//Delete Cart
router.delete(
  "/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.json("cart has been deleted...");
  }
);

//Get User Cart
router.get("/find/:userId", verifyTokenAutorize, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart);
});

//Get All Carts
router.get("/", verifyTokenAdmin, async (req, res) => {
  const carts = await Cart.find();
  res.json(carts);
});

module.exports = router;
