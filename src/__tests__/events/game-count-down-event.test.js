const { test } = require('@jest/globals');
const { describe } = require('@jest/globals');
const { createToken } = require('../../utils/jwt-utils');
const { expect } = require('@jest/globals');
const { SOCKET } = require('../../consts/routes');
const { beforeEach } = require('@jest/globals');
const { initSocketServer } = require('../../utils/init-websocket-server-test');
const { afterEach } = require('@jest/globals');
const ERROR = require('../../consts/errors');

jest.mock('../../services/random-text-service', () => ({
  getRandomText: () => Promise.resolve('Hello'),
}));

describe('game count down socket', () => {
  let clientSocket, server, generateNewConnection;
  beforeEach((done) => {
    const client = initSocketServer(done, SOCKET.GAME.NAMESPACE);
    clientSocket = client.socket;
    server = client.server;
    generateNewConnection = client.generateNewConnection;
  });

  afterEach(() => {
    clientSocket.disconnect();
    server.close();
  });

  test('should not start if there are not 2 player minimun', (done) => {
    const clientSocketOnSpy = jest.fn();

    createToken({ id: '1' }).then((token) => {
      clientSocket.on(SOCKET.ERROR, (error) => {
        expect(clientSocketOnSpy).not.toHaveBeenCalled();
        expect(error.errorCode).toBe(ERROR.PLAYER_CAN_NOT_START.errorCode);
        done();
      });

      clientSocket.on(SOCKET.GAME.START, clientSocketOnSpy);

      clientSocket.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.START, { interval: 100, count: 3 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
    });
  });

  test('should start coutdown', (done) => {
    const secondClient = generateNewConnection();
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
            secondClient.disconnect();
            done();
            break;
        }
      });

      secondClient.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.START, { interval: 100, count: 3 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second player' });
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
          secondClient.disconnect();
          done();
        }
      });
      const secondClient = generateNewConnection();

      secondClient.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.START, { interval: 100, count: 4 });
        clientSocket.emit(SOCKET.GAME.START, { interval: 2000, count: 0 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second player' });
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

    clientSocket.emit(SOCKET.GAME.START, { count: 3, interval: 100 });
  });

  test('should send word while is starting', (done) => {
    const secondClient = generateNewConnection();
    createToken({ id: '1' }).then((token) => {
      clientSocket.on(SOCKET.GAME.RANDOM_TEXT, (data) => {
        expect(data.text).not.toBeUndefined();
        expect(data.text).toBe('Hello');
        secondClient.disconnect();
        done();
      });

      secondClient.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.START, { interval: 100, count: 3 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second player' });
    });
  });
  test('should emit start event only the first player connected', (done) => {
    const clientOnStartSpy = jest.fn();
    const secondClientOnStartSpy = jest.fn();
    const secondClient = generateNewConnection();

    createToken({ id: '1' }).then((token) => {
      clientSocket.on(SOCKET.GAME.START, clientOnStartSpy);
      secondClient.on(SOCKET.GAME.START, secondClientOnStartSpy);

      secondClient.on(SOCKET.ERROR, (error) => {
        expect(clientOnStartSpy).not.toHaveBeenCalled();
        expect(secondClientOnStartSpy).not.toHaveBeenCalled();
        expect(error.errorCode).toBe(ERROR.PLAYER_CAN_NOT_START.errorCode);
        done();
      });

      secondClient.on(SOCKET.GAME.JOIN, () => {
        secondClient.emit(SOCKET.GAME.START, { interval: 100, count: 3 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'me' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second player' });
    });
  });
});
