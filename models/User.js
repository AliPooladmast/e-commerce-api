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
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    isAdmin: { type: Boolean, default: false },
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

const schema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string()
    .min(5)
    .max(255)
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().min(5).max(1024).required(),
});

module.exports.User = mongoose.model("User", UserSchema);
module.exports.schema = schema;
