module.exports = function (err, req, res, next) {
  console.log(err.message);
  res.status(500).json("something is wrong");
};
