const { beforeEach } = require('@jest/globals');
const { test } = require('@jest/globals');
const { describe } = require('@jest/globals');
const { SOCKET } = require('../../consts/routes');
const { initSocketServer } = require('../../utils/init-websocket-server-test');
const { afterEach } = require('@jest/globals');
const { createToken } = require('../../utils/jwt-utils');
const { expect } = require('@jest/globals');
const ERROR = require('../../consts/errors');

describe('game event socket', () => {
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

  test('should join', (done) => {
    createToken({ id: '1' }).then((token) => {
      clientSocket.on(SOCKET.GAME.JOIN, (data) => {
        expect(data.token).not.toBeUndefined();
        expect(data.connections).not.toBeUndefined();
        expect(data.players).not.toBeUndefined();

        done();
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'example' });
    });
  });

  test('should not join when token is invalid', (done) => {
    clientSocket.on(SOCKET.ERROR, (err) => {
      expect(err.errorCode).toBe(ERROR.INVALID_ROOM_TOKEN.errorCode);
      done();
    });

    clientSocket.emit(SOCKET.GAME.JOIN, { token: '123', name: 'example' });
  });

  test('should connect max 2 users', (done) => {
    createToken({ id: '1' }).then((token) => {
      expect.assertions(9);
      const secondClient = generateNewConnection();
      const thirdClient = generateNewConnection();

      let connections = 0;
      let secondClientConnection = 0;

      thirdClient.on(SOCKET.ERROR, (err) => {
        expect(err.errorCode).toBe(ERROR.TOO_MANY_CONNECTIONS.errorCode);
        done();
        thirdClient.disconnect();
      });

      secondClient.on(SOCKET.GAME.JOIN, (data) => {
        expect(data.connections).not.toBeUndefined();
        expect(data.connections).toBe(2);

        secondClientConnection++;
        if (secondClientConnection === 1) {
          expect(data.players).toContainEqual({
            id: secondClient.id,
            name: 'second',
          });
        }

        secondClient.disconnect();
      });

      clientSocket.on(SOCKET.GAME.JOIN, (data) => {
        expect(data.token).not.toBeUndefined();
        expect(data.connections).not.toBeUndefined();
        connections++;
        if (connections === 1) {
          expect(data.players).toContainEqual({
            id: clientSocket.id,
            name: 'example',
          });
        }
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'example' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second' });
      thirdClient.emit(SOCKET.GAME.JOIN, { token, name: 'third' });
    });
  });

  test('should decrement connections', (done) => {
    createToken({ id: '1' }).then((token) => {
      expect.assertions(13);
      const secondClient = generateNewConnection();

      let connections = 0;

      secondClient.on(SOCKET.GAME.JOIN, (data) => {
        expect(data.connections).not.toBeUndefined();
        expect(data.connections).toBe(2);

        secondClient.disconnect();
      });

      clientSocket.on(SOCKET.GAME.JOIN, (data) => {
        expect(data.token).not.toBeUndefined();
        expect(data.connections).not.toBeUndefined();
        expect(data.players).not.toBeUndefined();

        connections++;
        if (connections === 3) {
          expect(data.connections).toBe(1);
          expect(data.players).not.toContainEqual({
            id: secondClient.id,
            name: 'second',
          });
          done();
        }
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'example' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second' });
    });
  });
});
