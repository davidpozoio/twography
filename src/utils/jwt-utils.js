const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const environment = require("../config/environment");

exports.createToken = (payload) => {
  return promisify(jwt.sign)(payload, environment.secret, { expiresIn: "1d" });
};

exports.verifyToken = (token) => {
  return promisify(jwt.verify)(token, environment.secret);
};
