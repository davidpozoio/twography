const { Server } = require("socket.io");
const server = require("./app");
const { SOCKET } = require("./consts/routes");

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on(SOCKET.ERROR, (error) => {
    socket.emit(SOCKET.ERROR, error);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const connections =
      io?.sockets?.adapter?.rooms?.get(roomState.connectedRoomToken)?.size || 0;
    io.to(roomState.connectedRoomToken).emit(SOCKET.CONNECT_ROOM, {
      connections,
      token: roomState.connectedRoomToken,
    });
  });
});

require("./events/room-event")(io);

module.exports = {
  io,
  server: (port) => {
    return server.listen(port, () => {
      console.log(`the server has started in ${port}`);
    });
  },
};
