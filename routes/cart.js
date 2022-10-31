const {
  verifyTokenAutorize,
  verifyTokenAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const { Cart, schema } = require("../models/Cart");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validateSchema");

//Create Cart
router.post("/", [verifyToken, validate(schema)], async (req, res) => {
  const newCart = new Cart(req.body);

  const savedCart = await newCart.save();
  res.json(savedCart);
});

//Upadate Cart
router.put(
  "/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedCart)
      return res.status(404).json("the cart with the current ID was not found");

    res.json(updatedCart);
  }
);

//Delete Cart
router.delete(
  "/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    const cart = await Cart.findByIdAndDelete(req.params.id);

    if (!cart)
      return res.status(404).json("the cart with the current ID was not found");

    res.json("cart has been deleted...");
  }
);

//Get User Cart
router.get(
  "/find/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.id });

    if (!cart)
      return res
        .status(404)
        .json("the cart with the current user ID was not found");

    res.json(cart);
  }
);

//Get All Carts
router.get("/", verifyTokenAdmin, async (req, res) => {
  const carts = await Cart.find();

  if (!carts?.length > 0) return res.status(404).json("carts was not found");

  res.json(carts);
});

module.exports = router;
