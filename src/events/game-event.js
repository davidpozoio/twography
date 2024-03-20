const Joi = require('joi');
const { SOCKET } = require('../consts/routes');
const { verifyToken } = require('../utils/jwt-utils');
const ERROR = require('../consts/errors');
const { getRandomText } = require('../services/random-text-service');
const { getRoomPlayers } = require('../utils/get-room-players');

const gameJoinSchema = Joi.object({
  token: Joi.string().required(),
  name: Joi.string().required(),
});

const gameCountDownSchema = Joi.object({
  count: Joi.number().default(3).required(),
  interval: Joi.number().default(1000).required(),
});

const gameTextSchema = Joi.object({
  text: Joi.string().required(),
});

const gameWinnerSchema = Joi.object({
  time: Joi.number().required(),
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

      if (error || !data) {
        return socket.emit(SOCKET.ERROR, { ...ERROR.INVALID_SCHEMA, error });
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
      //set data attribute to share name between sockets and set canStart param to define
      //if the player can start the countdown

      socket.data = { name: roomState.name };

      const players = game.adapter.rooms.get(data.token);

      return game.to(data.token).emit(SOCKET.GAME.JOIN, {
        token: data.token,
        connections,
        players: Array.from(players).map((id, index) => {
          const name = game.sockets.get(id).data.name;
          if (index === 0) {
            game.sockets.get(id).data.canStart = true;
            return { id, name, canStart: true };
          }
          return { id, name, canStart: false };
        }),
      });
    });

    socket.on(SOCKET.GAME.START, (data) => {
      const { error, value } = gameCountDownSchema.validate(data);
      if (error || !data) {
        return socket.emit(SOCKET.ERROR, { ...ERROR.INVALID_SCHEMA, error });
      }
      if (!roomState.token)
        return socket.emit(SOCKET.ERROR, ERROR.ROOM_CONNECTION_REQUIRED);

      data = value;

      if (data.count > 3 || data.count < 0) {
        return socket.emit(SOCKET.ERROR, ERROR.SECONDS_LIMIT_EXCEEDED);
      }

      if (data.interval > 1000 || data.interval < 0) {
        return socket.emit(SOCKET.ERROR, ERROR.INTERVAL_LIMIT_EXCEEDED);
      }

      if (
        getRoomPlayers(game, roomState.token).length === 1 ||
        !socket.data.canStart
      ) {
        return socket.emit(SOCKET.ERROR, ERROR.PLAYER_CAN_NOT_START);
      }

      getRandomText()
        .then((word) => {
          return socket.emit(SOCKET.GAME.RANDOM_TEXT, { text: word });
        })
        .catch((error) => {
          return socket.emit(SOCKET.ERROR, { error });
        });

      let seconds = data.count;
      const counter = setInterval(() => {
        game.to(roomState.token).emit(SOCKET.GAME.START, { count: seconds });
        seconds--;
        if (seconds === -1) {
          clearInterval(counter);
        }
      }, data.interval);
    });

    socket.on(SOCKET.GAME.TEXT, (data) => {
      if (!roomState.token)
        return socket.emit(SOCKET.ERROR, ERROR.ROOM_CONNECTION_REQUIRED);

      const { error } = gameTextSchema.validate(data);
      if (error || !data) {
        return socket.emit(SOCKET.ERROR, { ...ERROR.INVALID_SCHEMA, error });
      }

      socket.broadcast
        .to(roomState.token)
        .emit(SOCKET.GAME.TEXT, { id: socket.id, text: data.text });
    });

    socket.on(SOCKET.GAME.WINNER, (data) => {
      if (!roomState.token) {
        return socket.emit(SOCKET.ERROR, ERROR.ROOM_CONNECTION_REQUIRED);
      }

      const { error } = gameWinnerSchema.validate(data);
      if (error || !data) {
        return socket.emit(SOCKET.ERROR, { ...ERROR.INVALID_SCHEMA, error });
      }

      game.to(roomState.token).emit(SOCKET.GAME.WINNER, {
        id: socket.id,
        name: roomState.name,
        time: data.time,
      });
    });

    socket.on('disconnect', () => {
      if (roomState.token) {
        socket.leave(roomState.token);
        const connections = game.adapter.rooms?.get(roomState.token)?.size;
        const players = game.adapter.rooms?.get(roomState.token);

        return game.to(roomState.token).emit(SOCKET.GAME.JOIN, {
          token: roomState.token,
          connections,
          players: Array.from(players || []).map((id, index) => {
            if (index === 0)
              return { id, name: roomState.name, canStart: true };
            return { id, name: roomState.name, canStart: false };
          }),
        });
      }
    });
  });
};
