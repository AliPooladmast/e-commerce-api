const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

//Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  !user && res.status(401).json("Wrong Credentials");

  const password = CryptoJS.AES.decrypt(
    user.password,
    process.env.SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  password !== req.body.password && res.status(401).json("Wrong Credentials");

  res.json(user);
});

module.exports = router;
