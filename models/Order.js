const mongoose = require("mongoose");
const Joi = require("joi");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true, min: 1 },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const schema = Joi.object({
  userId: Joi.string().hex().required(),
  products: Joi.array().required(),
  amount: Joi.number().min(1).required(),
  address: Joi.object().required(),
  status: Joi.string().default("pending"),
});

module.exports.Order = mongoose.model("Order", OrderSchema);
module.exports.schema = schema;
