const { validationResult } = require("express-validator");

exports.asyncErrorHandler = (controller = () => new Promise()) => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors.array());
    }
    controller(req, res, next).catch((err) => next(err));
  };
};
