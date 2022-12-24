const {
  verifyTokenAutorize,
  verifyTokenAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { Order, createSchema, editSchema } = require("../models/Order");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validateSchema");
const { Product } = require("../models/Product");

//Create Order
router.post(
  "/",
  [verifyTokenAdmin, validate(createSchema)],
  async (req, res) => {
    const newOrder = new Order(req.body);

    const savedOrder = await newOrder.save();

    res.json(savedOrder);
  }
);

//Upadate Order
router.put(
  "/:id",
  [validateObjectId, verifyTokenAutorize, validate(editSchema)],
  async (req, res) => {
    const order = await Order.findById(req.query.orderId);

    if (!order)
      return res
        .status(404)
        .json("the order with the current ID was not found");

    if (order.userId !== req.params.id)
      return res
        .status(403)
        .json("you are not allowd to change other users orders");

    order.set(req.body);
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  }
);

//Delete Order
router.delete(
  "/:id",
  [validateObjectId, verifyTokenAutorize],
  async (req, res) => {
    const order = await Order.findById(req.query.orderId);

    if (!order)
      return res
        .status(404)
        .json("the order with the current ID was not found");

    if (order.userId !== req.params.id)
      return res
        .status(403)
        .json("you are not allowd to remove other users orders");

    const deletedOrder = await order.remove();

    if (deletedOrder) return res.json("order has been deleted...");
  }
);

//Get Order Products
router.get(
  "/products/:id",
  [verifyToken, validateObjectId],
  async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json("the order with the current ID was not found");

    const productIds = order.products.map((item) => item.productId);

    const orderProducts = await Product.find({
      _id: { $in: productIds },
    });

    const result = orderProducts.reverse().map((item, index) => ({
      ...item._doc,
      size: order.products[index].size,
      color: order.products[index].color,
      quantity: order.products[index].quantity,
    }));

    res.json(result);
  }
);

//Get User Order
router.get(
  "/find/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    const order = await Order.find({ userId: req.params.id });

    if (!order?.length > 0)
      return res
        .status(404)
        .json("orders with the current user ID was not found");

    res.json(order);
  }
);

//Get All Orders
router.get("/", verifyTokenAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  if (!orders?.length > 0) return res.status(404).json("orders not found");

  res.json(orders);
});

//Get Monthly Incomes
router.get("/income", verifyTokenAdmin, async (req, res) => {
  const productId = req.params.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));

  const income = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: previousMonth },
        ...(productId && { products: { $elemMatch: productId } }),
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$amount",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);

  if (!income?.length > 0) return res.status(404).json("incomes not found");

  res.json(income);
});

module.exports = router;
