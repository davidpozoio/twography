const { beforeEach } = require('@jest/globals');
const { test } = require('@jest/globals');
const { describe } = require('@jest/globals');
const { initSocketServer } = require('../../utils/init-websocket-server-test');
const { SOCKET } = require('../../consts/routes');
const { afterEach } = require('@jest/globals');
const { createToken } = require('../../utils/jwt-utils');
const { expect } = require('@jest/globals');
const ERROR = require('../../consts/errors');

describe('game text event socket', () => {
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

  test('should send text', (done) => {
    createToken({ id: '1' }).then((token) => {
      const secondClient = generateNewConnection();

      secondClient.on(SOCKET.GAME.TEXT, (data) => {
        expect(data.id).not.toBeUndefined();
        expect(data.text).not.toBeUndefined();
        expect(data.text).toBe('hello');
        secondClient.emit(SOCKET.GAME.TEXT, {
          text: 'hello from second client',
        });
      });

      clientSocket.on(SOCKET.GAME.TEXT, (data) => {
        expect(data.text).toBe('hello from second client');
        secondClient.disconnect();
        done();
      });

      clientSocket.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.TEXT, { text: 'hello' });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'first' });
      secondClient.emit(SOCKET.GAME.JOIN, { token, name: 'second' });
    });
  });

  test('should not send text when the user is not connected to a room', (done) => {
    clientSocket.on(SOCKET.ERROR, (error) => {
      expect(error.errorCode).toBe(ERROR.ROOM_CONNECTION_REQUIRED.errorCode);
      done();
    });

    clientSocket.emit(SOCKET.GAME.TEXT, { text: 'hello' });
  });
});
