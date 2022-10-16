const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

//Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).json("Wrong Credentials");

  const originalPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASSWORD_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  if (originalPassword !== req.body.password)
    return res.status(401).json("Wrong Credentials");

  const accessToken = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "3d" }
  );
  const { password, ...others } = user._doc;
  others.token = accessToken;

  res.json(others);
});

module.exports = router;
