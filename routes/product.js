const { verifyTokenAdmin } = require("../middleware/verifyToken");
const router = require("express").Router();
const { Product, schema } = require("../models/Product");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validateSchema");

//Create Product
router.post("/", [verifyTokenAdmin, validate(schema)], async (req, res) => {
  const newProduct = new Product(req.body);

  const savedProduct = await newProduct.save();

  res.json(savedProduct);
});

//Upadate Product
router.put("/:id", [verifyTokenAdmin, validateObjectId], async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedProduct)
    return res
      .status(404)
      .json("the product with the current ID was not found");

  res.json(updatedProduct);
});

//Delete Product
router.delete(
  "/:id",
  [verifyTokenAdmin, validateObjectId],
  async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res
        .status(404)
        .json("the product with the current ID was not found");

    res.json("product has been deleted...");
  }
);

//Get Product
router.get("/find/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res
      .status(404)
      .json("the product with the current ID was not found");

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

  if (!products?.length > 0) return res.status(404).json("products not found");

  res.json(products);
});

module.exports = router;
