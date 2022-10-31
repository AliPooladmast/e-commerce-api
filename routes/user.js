const {
  verifyTokenAutorize,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { User } = require("../models/User");
const validateObjectId = require("../middleware/validateObjectId");

//Upadate User
router.put(
  "/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json("the user with the current ID was not found");

    res.json(updatedUser);
  }
);

//Delete User
router.delete(
  "/:id",
  [verifyTokenAutorize, validateObjectId],
  async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res.status(404).json("the user with the current ID was not found");

    res.json("user has been deleted...");
  }
);

//Get User
router.get(
  "/find/:id",
  [verifyTokenAdmin, validateObjectId],
  async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      return res.status(404).json("the user with the current ID was not found");

    res.json(user);
  }
);

//Get All Users
router.get("/", verifyTokenAdmin, async (req, res) => {
  const users = req.query.new
    ? await User.find().select("-password").sort({ _id: -1 }).limit(5)
    : await User.find().select("-password");

  if (!users?.length > 0) return res.status(404).json("users not found");

  res.json(users);
});

//Get User Stats
router.get("/stats", verifyTokenAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    { $project: { month: { $month: "$createdAt" } } },
    { $group: { _id: "$month", total: { $sum: 1 } } },
  ]);

  if (!data?.length > 0) return res.status(404).json("user stats not found");

  res.json(data);
});

module.exports = router;
