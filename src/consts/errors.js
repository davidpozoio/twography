const ERROR = {
  ROUTE_NOT_FOUND: {
    statusCode: 404,
    errorCode: 1001,
    message: 'route not found',
  },
  INVALID_ROOM_TOKEN: {
    errorCode: 1002,
    message: 'invalid token',
  },
  TOKEN_IS_REQUIRED: {
    errorCode: 1003,
    message: 'token is required',
  },
  TOO_MANY_CONNECTIONS: {
    errorCode: 1004,
    message: "it's only allowed two connections for each room",
  },
  SECONDS_LIMIT_EXCEEDED: {
    errorCode: 1005,
    message: 'you must put a number in the range from 0 to 3',
  },
  INTERVAL_LIMIT_EXCEEDED: {
    errorCode: 1006,
    message: 'you must put a number in the range from 0 to 1000',
  },
  ROOM_CONNECTION_REQUIRED: {
    errorCode: 1007,
    message: 'you must join to a room before',
  },
};

module.exports = ERROR;
