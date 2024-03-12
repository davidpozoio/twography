const Joi = require('joi');
const { SOCKET } = require('../consts/routes');
const { verifyToken } = require('../utils/jwt-utils');
const ERROR = require('../consts/errors');

const gameJoinSchema = Joi.object({
  token: Joi.string().required(),
  name: Joi.string().required(),
});

const gameCountDownSchema = Joi.object({
  count: Joi.number().default(3),
  interval: Joi.number().default(1000),
});

module.exports = (io) => {
  const game = io.of(SOCKET.GAME.NAMESPACE);
  game.on('connection', (socket) => {
    const roomState = {
      token: undefined,
      name: undefined,
    };
    socket.on(SOCKET.GAME.JOIN, async (data) => {
      const { error } = gameJoinSchema.validate(data);
      if (error) {
        return socket.emit(SOCKET.ERROR, { error });
      }

      const isValid = await verifyToken(data.token);
      if (!isValid) {
        return socket.emit(SOCKET.ERROR, ERROR.INVALID_ROOM_TOKEN);
      }

      socket.join(data.token);

      const connections = game.adapter.rooms.get(data.token).size;

      if (connections === 3) {
        socket.leave(data.token);
        return socket.emit(SOCKET.ERROR, ERROR.TOO_MANY_CONNECTIONS);
      }

      roomState.token = data.token;
      roomState.name = data.name;

      const players = game.adapter.rooms.get(data.token);

      return game.to(data.token).emit(SOCKET.GAME.JOIN, {
        token: data.token,
        connections,
        players: Array.from(players).map((id) => {
          return { id, name: data.name };
        }),
      });
    });

    socket.on(SOCKET.GAME.START, (data) => {
      if (!roomState.token)
        return socket.emit(SOCKET.ERROR, ERROR.ROOM_CONNECTION_REQUIRED);

      const { error, value } = gameCountDownSchema.validate(data);
      if (error) {
        return socket.emit(SOCKET.ERROR, { error });
      }

      data = value;

      if (data.count > 3 || data.count < 0) {
        return socket.emit(SOCKET.ERROR, ERROR.SECONDS_LIMIT_EXCEEDED);
      }

      if (data.interval > 1000 || data.interval < 0) {
        return socket.emit(SOCKET.ERROR, ERROR.INTERVAL_LIMIT_EXCEEDED);
      }

      let seconds = data.count;
      const counter = setInterval(() => {
        game.to(roomState.token).emit(SOCKET.GAME.START, { count: seconds });
        seconds--;
        if (seconds === -1) {
          clearInterval(counter);
        }
      }, data.interval);
    });

    socket.on('disconnect', () => {
      if (roomState.token) {
        socket.leave(roomState.token);
        const connections = game.adapter.rooms?.get(roomState.token)?.size;

        const players = game.adapter.rooms?.get(roomState.token);

        return game.to(roomState.token).emit(SOCKET.GAME.JOIN, {
          token: roomState.token,
          connections,
          players: Array.from(players || []).map((id) => {
            return { id, name: roomState.name };
          }),
        });
      }
    });
  });
};
