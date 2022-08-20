const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-headr");
  if (!token)
    return res.status(401).json("access denied, token is not provided");

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json("token is not valid");
    req.user = user;
    return next();
  });
};

module.exports = { verifyToken };
