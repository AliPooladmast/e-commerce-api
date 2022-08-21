const {
  verifyTokenAutorize,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");

//Upadate User
router.put("/:id", verifyTokenAutorize, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();
  }

  updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedUser);
});

//Delete User
router.delete("/:id", verifyTokenAutorize, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("user has been deleted...");
});

//Get User
router.get("/:id", verifyTokenAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  const { password, ...other } = user._doc;
  res.json(other);
});

//Get All Users
router.get("/", verifyTokenAdmin, async (req, res) => {
  const users = req.query.new
    ? await User.find().sort({ _id: -1 }).limit(5)
    : await User.find();
  const safeUsers = users.map((user) => {
    const { password, ...other } = user._doc;
    return other;
  });
  res.json(safeUsers);
});

module.exports = router;
