const router = require("express").Router();
const Stripe = require("stripe");

router.post("/payment", async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_KEY);
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.json(stripeRes);
      }
    }
  );
});

module.exports = router;
