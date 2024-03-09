const { Server } = require("socket.io");
const server = require("./app");
const { SOCKET } = require("./consts/routes");
const { createToken, verifyToken } = require("./utils/jwt-utils");
const ERROR = require("./consts/errors");
const SocketError = require("./utils/socket-error");

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  const socketState = {
    connectedRoomToken: "",
  };

  socket.on(SOCKET.ERROR, (error) => {
    socket.emit(SOCKET.ERROR, error);
  });

  socket.on(SOCKET.CREATE_ROOM, async () => {
    const token = await createToken({ id: "" });
    socket.emit(SOCKET.CREATE_ROOM, { token });
  });

  socket.on(SOCKET.CONNECT_ROOM, async ({ token = "" }) => {
    try {
      await verifyToken(token);
      socket.join(token);
      socketState.connectedRoomToken = token;
      const connections = io.sockets.adapter.rooms.get(token).size || 0;
      if (connections >= 3) {
        throw new SocketError(ERROR.TOO_MANY_CONNECTIONS);
      }
      io.to(token).emit(SOCKET.CONNECT_ROOM, { connections, token });
    } catch (error) {
      if (error.isOptional) {
        return socket.emit(SOCKET.ERROR, {
          errorCode: error.errorCode,
          message: error.message,
        });
      }
      return socket.emit(SOCKET.ERROR, ERROR.INVALID_ROOM_TOKEN);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const connections =
      io?.sockets?.adapter?.rooms?.get(socketState.connectedRoomToken)?.size ||
      0;
    io.to(socketState.connectedRoomToken).emit(SOCKET.CONNECT_ROOM, {
      connections,
      token: socketState.connectedRoomToken,
    });
  });
});

module.exports = {
  io,
  server: (port) => {
    server.listen(port, () => {
      console.log(`the server has started in ${port}`);
    });
  },
};
