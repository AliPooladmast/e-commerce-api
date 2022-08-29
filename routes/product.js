const {
  verifyTokenAutorize,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Product = require("../models/Product");

//Create Product
router.post("/", verifyTokenAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  const savedProduct = await newProduct.save();
  res.json(savedProduct);
});

//Upadate Product
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedProduct);
});

//Delete Product
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json("product has been deleted...");
});

//Get Product
router.get("/find/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

//Get All Products
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  let products;

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
  } else if (qCategory) {
    products = await Product.find({ categories: { $in: [qCategory] } });
  } else {
    products = await Product.find();
  }

  res.json(products);
});

module.exports = router;
