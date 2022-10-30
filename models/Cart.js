const mongoose = require("mongoose");
const Joi = require("joi");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const schema = Joi.object({
  userId: Joi.string().hex().required(),
  products: Joi.array().required(),
});

module.exports.Cart = mongoose.model("Cart", CartSchema);
module.exports.schema = schema;
