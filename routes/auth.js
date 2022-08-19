const router = require("express").Router();
const User = require("../models/User");
const cryptoJS = require("crypto-js");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY),
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

module.exports = router;
