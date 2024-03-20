const { SOCKET } = require('../consts/routes');

exports.asyncErrorHandler = (socket, event = () => new Promise()) => {
  return (data) => {
    event(data).catch((error) => {
      if (error.isOperational) {
        socket.emit(SOCKET.ERROR, { error });
      }
    });
  };
};
