const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    desc: {
      type: String,
      minlength: 3,
      maxlength: 1024,
    },
    img: { type: String },
    categories: {
      type: [
        {
          type: String,
          minlength: 1,
          maxlength: 20,
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    size: {
      type: [
        {
          type: String,
          minlength: 1,
          maxlength: 5,
        },
      ],
      required: true,
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    color: {
      type: [
        {
          type: String,
          minlength: 1,
          maxlength: 20,
        },
      ],
      required: true,
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    price: { type: Number, required: true, min: 1 },
    inStock: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const schema = Joi.object({
  title: Joi.string().min(3).max(50).required().trim(),
  desc: Joi.string().min(3).max(1024),
  img: Joi.string().min(0),
  categories: Joi.array().max(10).items(Joi.string().min(1).max(20)),
  size: Joi.array().required().max(10).items(Joi.string().min(1).max(5)),
  color: Joi.array().required().max(10).items(Joi.string().min(1).max(20)),
  price: Joi.number().min(1).required(),
  inStock: Joi.number().min(1).required(),
});

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports.Product = mongoose.model("Product", ProductSchema);
module.exports.schema = schema;
