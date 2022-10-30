const mongoose = require("mongoose");

module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    next();
  };
};
