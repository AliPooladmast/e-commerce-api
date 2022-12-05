const router = require("express").Router();
const { User, createSchema } = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const validateSchema = require("../middleware/validateSchema");

//Register
router.post("/register", validateSchema(createSchema), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("User already registered.");

  const { reqPassword, ...reqOthers } = req.body;

  user = new User({
    ...reqOthers,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
  });

  const savedUser = await user.save();

  const accessToken = savedUser.generateAuthToken();
  const { resPassword, ...resOthers } = savedUser._doc;
  resOthers.token = accessToken;

  res.status(201).json(resOthers);
});

//Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).json("User Not Registered");

  const originalPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASSWORD_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  if (originalPassword !== req.body.password)
    return res.status(401).json("Wrong Password");

  const accessToken = user.generateAuthToken();
  const { password, ...others } = user._doc;
  others.token = accessToken;

  res.json(others);
});

module.exports = router;
