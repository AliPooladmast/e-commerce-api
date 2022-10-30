const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    desc: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    img: { type: String, required: true },
    categories: { type: Array, required: true },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const schema = Joi.object({
  title: Joi.string().min(5).max(50).required().trim(),
  desc: Joi.string().min(5).max(1024).required(),
  img: Joi.string().required(),
  categories: Joi.array().required(),
  size: Joi.array(),
  color: Joi.array(),
  price: Joi.number().min(0).required(),
  inStock: Joi.boolean().default(true),
});

module.exports.Product = mongoose.model("Product", ProductSchema);
module.exports.schema = schema;
