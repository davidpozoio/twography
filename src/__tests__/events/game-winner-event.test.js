const { beforeEach } = require('@jest/globals');
const { test } = require('@jest/globals');
const { describe } = require('@jest/globals');
const { initSocketServer } = require('../../utils/init-websocket-server-test');
const { SOCKET } = require('../../consts/routes');
const { afterEach } = require('@jest/globals');
const { createToken } = require('../../utils/jwt-utils');
const { expect } = require('@jest/globals');

describe('game winner event socket', () => {
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

  test('should emit winner', (done) => {
    createToken({ id: '1' }).then((token) => {
      clientSocket.on(SOCKET.GAME.WINNER, (data) => {
        expect(data.id).toBe(clientSocket.id);
        expect(data.name).toBe('first');
        expect(data.time).toBe(100);
        done();
      });

      clientSocket.on(SOCKET.GAME.JOIN, () => {
        clientSocket.emit(SOCKET.GAME.WINNER, { time: 100 });
      });

      clientSocket.emit(SOCKET.GAME.JOIN, { token, name: 'first' });
    });
  });
});
