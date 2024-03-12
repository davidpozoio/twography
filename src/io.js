const { Server } = require('socket.io');
const server = require('./app');
const { SOCKET } = require('./consts/routes');

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  socket.on(SOCKET.ERROR, (error) => {
    socket.emit(SOCKET.ERROR, error);
  });

  socket.on('disconnect', () => {});
});

require('./events/room-event')(io);
require('./events/game-event')(io);

module.exports = {
  server: (port) => {
    return server.listen(port, () => {
      console.log(`the server has started in ${port}`);
    });
  },
  testingServer: () => {
    return server.listen(0, () => {
      console.log(`the server has started in ${server.address().port}`);
    });
  },
};
