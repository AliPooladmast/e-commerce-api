const mongoose = require("mongoose");
const Joi = require("joi");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: {
      type: [
        {
          productId: { type: String, required: true },
          quantity: {
            type: Number,
            default: 1,
            min: 1,
            max: 10,
          },
        },
      ],
      required: true,
      validate: [arrayLimit, "{PATH} exceeds the limit of 100"],
    },
    amount: { type: Number, required: true, min: 1, max: 1000 },
    phone: {
      type: String,
      minlength: 5,
      maxlength: 20,
      required: true,
    },
    address: {
      type: String,
      minlength: 5,
      maxlength: 511,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      minlength: 1,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

const createSchema = Joi.object({
  products: Joi.array()
    .required()
    .min(1)
    .max(100)
    .items(
      Joi.object({
        productId: Joi.string().hex().required(),
        quantity: Joi.number().min(1).max(10),
      })
    ),
  phone: Joi.string().min(5).max(20).required(),
  address: Joi.string().min(5).max(511).required(),
});

const editSchema = Joi.object({
  phone: Joi.string().min(5).max(20).required(),
  address: Joi.string().min(5).max(511).required(),
});

function arrayLimit(val) {
  return val.length <= 100;
}

module.exports.Order = mongoose.model("Order", OrderSchema);
module.exports.createSchema = createSchema;
module.exports.editSchema = editSchema;
