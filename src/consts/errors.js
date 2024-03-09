const ERROR = {
  ROUTE_NOT_FOUND: {
    statusCode: 404,
    errorCode: 1001,
    message: "route not found",
  },
  INVALID_ROOM_TOKEN: {
    errorCode: 1002,
    message: "invalid token",
  },
  TOKEN_IS_REQUIRED: {
    errorCode: 1003,
    message: "token is required",
  },
  TOO_MANY_CONNECTIONS: {
    errorCode: 1004,
    message: "it's only allowed two connections for each room",
  },
};

module.exports = ERROR;
