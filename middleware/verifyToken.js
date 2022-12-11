const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token?.split(" ")?.[1];

  if (!token)
    return res.status(401).json("access denied, token is not provided");

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json("access denied, token is not valid");
    req.user = user;
    next();
  });
};

const verifyTokenAutorize = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json("access denied, not enough privileges to perform this action");
    }
    next();
  });
};

const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json("access denied, not enough privileges to perform this action");
    next();
  });
};

module.exports = { verifyToken, verifyTokenAutorize, verifyTokenAdmin };
