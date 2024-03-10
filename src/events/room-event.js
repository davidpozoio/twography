const Joi = require("joi");
const { SOCKET } = require("../consts/routes");

const roomJoinSchema = Joi.object({
  token: Joi.string().required(),
  name: Joi.string().required(),
});

module.exports = (io) => {
  io.of(SOCKET.ROOM.NAMESPACE).on("connection", (socket) => {
    socket.on(SOCKET.ROOM.CREATE, () => {
      socket.emit("room:create", { token: "12391" });
    });

    socket.on(SOCKET.ROOM.JOIN, (data) => {
      const { error } = roomJoinSchema.validate(data);
      if (error) {
        return socket.emit(SOCKET.ERROR, error);
      }
    });
  });
};
