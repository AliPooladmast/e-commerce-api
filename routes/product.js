const { verifyTokenAdmin } = require("../middleware/verifyToken");
const router = require("express").Router();
const { Product, schema } = require("../models/Product");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validateSchema");
const perPage = 2;

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

//Get Products Number of Pages
router.get("/pages", async (req, res) => {
  const result = await Product.count();

  if (!result) return res.status(404).json("database is empty");

  res.json(Math.round(result / perPage));
});

//Get All Products
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qPage = req.query.page;
  const qSize = req.query.size;
  const qColor = req.query.color;
  const qTitle = req.query.title;
  let products;
  let productCount;

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(8);
  } else if (qPage) {
    const result = await Product.aggregate([
      {
        $match: {
          ...(qCategory && { categories: { $in: [qCategory] } }),
          ...(qSize && { size: { $in: [qSize] } }),
          ...(qColor && { color: { $in: [qColor] } }),
          ...(qTitle && { title: { $regex: qTitle } }),
        },
      },
      {
        $facet: {
          products: [{ $skip: perPage * (qPage - 1) }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    products = result[0].products;
    pageCounts = result[0].totalCount[0].count / perPage;
  } else {
    products = await Product.find();
  }

  if (!products?.length > 0) return res.status(404).json("products not found");

  res.json({ products, pageCounts });
});

module.exports = router;
