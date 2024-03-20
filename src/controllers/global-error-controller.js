const environment = require('../config/environment');

exports.globalErrorController = (err, req, res, next) => {
  if (Array.isArray(err)) {
    return res.status(400).json({ errors: err });
  }
  if (!err.isOptional) {
    return res.status(500).json({
      error: {
        message:
          environment.developMode === environment.mode.prod
            ? 'server error has ocurred, try later!'
            : undefined,
        error:
          environment.developMode === environment.mode.prod ? undefined : err,
      },
    });
  }

  return res.status(err.statusCode).json({
    error: { ...err, isOptional: undefined },
  });
};
