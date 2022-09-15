module.exports = function () {
  if (!process.env.TOKEN_SECRET_KEY) {
    throw new Error("FATAL ERROR: token secret key is not defined.");
  }
};
