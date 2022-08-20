const { verifyTokenAutorize } = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");

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

module.exports = router;
