const { describe, test } = require('@jest/globals');
const { initSocketServer } = require('../utils/init-websocket-server-test');
const { SOCKET } = require('../consts/routes');
const ERROR = require('../consts/errors');
const { expect } = require('@jest/globals');
const { beforeAll } = require('@jest/globals');
const { afterAll } = require('@jest/globals');

describe('io websocket server', () => {
  let clientSocket;
  beforeAll((done) => {
    clientSocket = initSocketServer(done).socket;
  });

  afterAll(() => {
    clientSocket.disconnect();
  });

  test('should send error', (done) => {
    clientSocket.on(SOCKET.ERROR, (error) => {
      expect(error.errorCode).toBe(ERROR.ROUTE_NOT_FOUND.errorCode);
      done();
    });

    clientSocket.emit(SOCKET.ERROR, ERROR.ROUTE_NOT_FOUND);
  });
});
