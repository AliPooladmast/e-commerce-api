const router = require("express").Router();
const Stripe = require("stripe");
const { verifyTokenAutorize } = require("../middleware/verifyToken");
const { Product } = require("../models/Product");
const { createSchema, Order } = require("../models/Order");
const validateSchema = require("../middleware/validateSchema");
const validateObjectId = require("../middleware/validateObjectId");
const stripe = Stripe(process.env.STRIPE_KEY);

router.post(
  "/create-session/:id",
  [validateObjectId, verifyTokenAutorize, validateSchema(createSchema)],
  async (req, res) => {
    const { products } = req.body;

    const productIds = products.map((item) => item.productId);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
    });

    if (!dbProducts)
      return res.status(404).json("there are no such products on DB");

    const lineItems = dbProducts.reverse().map((item, index) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item._doc.title,
        },
        unit_amount: Math.round(item._doc.price * 100),
      },
      quantity: products[index].quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
    });

    const newOrder = new Order({
      ...req.body,
      userId: req.params.id,
      amount: session.amount_total,
      status: session.payment_status,
    });
    const savedOrder = await newOrder.save();

    res.json(savedOrder);
  }
);

module.exports = router;
