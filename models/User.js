const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    fullname: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    phone: {
      type: String,
      minlength: 5,
      maxlength: 20,
    },
    address: {
      type: String,
      minlength: 5,
      maxlength: 511,
    },
    password: { type: String, required: true, minlength: 5, maxlength: 1023 },
    isAdmin: { type: Boolean, default: false },
    img: { type: String, unique: true },
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "3d" }
  );
  return token;
};

const createSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  fullname: Joi.string().min(2).max(50),
  phone: Joi.string().min(5).max(20),
  address: Joi.string().min(5).max(511),
  email: Joi.string()
    .min(5)
    .max(255)
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().min(5).max(1023).required(),
  isAdmin: Joi.boolean(),
});

const editSchema = Joi.object({
  username: Joi.string().min(2).max(50),
  fullname: Joi.string().min(0).max(50),
  phone: Joi.string().min(0).max(20),
  address: Joi.string().min(0).max(511),
  img: Joi.string().min(0).max(1023),
  email: Joi.string()
    .min(5)
    .max(255)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
});

module.exports.User = mongoose.model("User", UserSchema);
module.exports.createSchema = createSchema;
module.exports.editSchema = editSchema;
