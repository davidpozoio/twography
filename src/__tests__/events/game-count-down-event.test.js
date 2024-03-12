const { test } = require('@jest/globals');
const { describe } = require('@jest/globals');
const { createToken } = require('../../utils/jwt-utils');
const { expect } = require('@jest/globals');
const { SOCKET } = require('../../consts/routes');
const { beforeEach } = require('@jest/globals');
const { initSocketServer } = require('../../utils/init-websocket-server-test');
const { afterEach } = require('@jest/globals');
const ERROR = require('../../consts/errors');

describe('game count down socket', () => {
  let clientSocket, server;
  beforeEach((done) => {
    const client = initSocketServer(done, SOCKET.GAME.NAMESPACE);
    clientSocket = client.socket;
    server = client.server;
  });

  afterEach(() => {
    clientSocket.disconnect();
    server.close();
  });

  test('should start coutdown', (done) => {
    createToken({ id: '1' }).then((token) => {
      let count = 0;

      clientSocket.on(SOCKET.GAME.START, (data) => {
        count++;
        switch (count) {
          case 1:
            expect(data.count).toBe(3);
            break;
          case 2:
            expect(data.count).toBe(2);
            break;
          case 3:
            expect(data.count).toBe(1);
            break;
          case 4:
            expect(data.count).toBe(0);
            done();
            break;
        }
      });

      clientSocket.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.START, { interval: 100 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
    });
  });

  test('should throw error when interval or count is out of the limits', (done) => {
    createToken({ id: '1' }).then((token) => {
      let count = 0;

      clientSocket.on(SOCKET.ERROR, (error) => {
        count++;
        if (count === 1) {
          expect(error.errorCode).toBe(ERROR.SECONDS_LIMIT_EXCEEDED.errorCode);
        }
        if (count === 2) {
          expect(error.errorCode).toBe(ERROR.INTERVAL_LIMIT_EXCEEDED.errorCode);
          done();
        }
      });

      clientSocket.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.START, { interval: 100, count: 4 });
        clientSocket.emit(SOCKET.GAME.START, { interval: 2000 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
    });
  });

  test("should not start coundown if it's not joined to a room", (done) => {
    const gameStartSpy = jest.fn(() => {});

    clientSocket.on(SOCKET.ERROR, (error) => {
      expect(error.errorCode).toBe(ERROR.ROOM_CONNECTION_REQUIRED.errorCode);
      expect(gameStartSpy).not.toHaveBeenCalled();
      done();
    });

    clientSocket.on(SOCKET.GAME.START, gameStartSpy);

    clientSocket.emit(SOCKET.GAME.START);
  });
});
