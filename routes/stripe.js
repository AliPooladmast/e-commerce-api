const router = require("express").Router();
const Stripe = require("stripe");
const { verifyTokenAutorize } = require("../middleware/verifyToken");
const { Product } = require("../models/Product");
const { schema, Order } = require("../models/Order");
const validateSchema = require("../middleware/validateSchema");
const validateObjectId = require("../middleware/validateObjectId");
const stripe = Stripe(process.env.STRIPE_KEY);

router.post(
  "/create-session/:id",
  [validateObjectId, verifyTokenAutorize, validateSchema(schema)],
  async (req, res) => {
    const { products } = req.body;

    const productIds = products.map((item) => item.productId);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
    });

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

    if (lineItems) {
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

      res.json(savedOrder.status);
    }
  }
);

module.exports = router;
