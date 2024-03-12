const { test } = require('@jest/globals');
const { describe } = require('@jest/globals');
const { SOCKET } = require('../../consts/routes');
const { expect } = require('@jest/globals');
const { verifyToken } = require('../../utils/jwt-utils');
const { beforeEach } = require('@jest/globals');
const { afterEach } = require('@jest/globals');

const {
  initManagerServer,
} = require('../../utils/init-manager-websocket-test');

describe('room event socket', () => {
  let clientSocket, server;

  beforeEach((done) => {
    const client = initManagerServer(done, [SOCKET.ROOM.NAMESPACE, '/']);
    clientSocket = client.sockets.get(SOCKET.ROOM.NAMESPACE);
    server = client.server;
  });

  afterEach(() => {
    clientSocket.disconnect();
    server.close();
  });

  test('should create room', (done) => {
    clientSocket.on(SOCKET.ROOM.CREATE, async (data) => {
      expect(data.token).not.toBeUndefined();
      const isValid = await verifyToken(data.token);
      expect(isValid).toBeTruthy();
      done();
    });

    clientSocket.emit(SOCKET.ROOM.CREATE);
  });
});
