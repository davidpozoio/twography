const { SOCKET } = require('../consts/routes');
const { createToken } = require('../utils/jwt-utils');

module.exports = (io) => {
  const rooms = io.of(SOCKET.ROOM.NAMESPACE);
  rooms.on('connection', (socket) => {
    socket.on(SOCKET.ROOM.CREATE, async () => {
      const token = await createToken({ id: socket.id });
      socket.emit(SOCKET.ROOM.CREATE, { token });
    });
  });
};
