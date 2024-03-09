const { describe, test, beforeAll, expect } = require("@jest/globals");
const ioc = require("socket.io-client");
const { SOCKET } = require("../consts/routes");
const ERROR = require("../consts/errors");

describe("io websocket server", () => {
  let io, clientSocket;
  beforeAll((done) => {
    io = require("../io").server(8085);
    clientSocket = ioc("http://localhost:8085");
    clientSocket.on("connect", done);
  });

  test("should create room", (done) => {
    clientSocket.on(SOCKET.CREATE_ROOM, async (data) => {
      expect(data.token).not.toBeUndefined();
      done();
    });

    clientSocket.emit(SOCKET.CREATE_ROOM);
  });

  test("should connect room", (done) => {
    clientSocket.on(SOCKET.CREATE_ROOM, async (data) => {
      expect(data.token).not.toBeUndefined();
      clientSocket.emit(SOCKET.CONNECT_ROOM, { token: data.token });
    });

    clientSocket.on(SOCKET.CONNECT_ROOM, (data) => {
      expect(data.connections).not.toBeUndefined();
      expect(data.token).not.toBeUndefined();
      done();
    });

    clientSocket.emit(SOCKET.CREATE_ROOM);
  });

  test("should not connect when token room is invalid", (done) => {
    clientSocket.on(SOCKET.ERROR, (data) => {
      expect(data).toEqual(ERROR.INVALID_ROOM_TOKEN);
      done();
    });

    clientSocket.emit(SOCKET.CONNECT_ROOM, { token: "123" });
  });

  test("should show error too many connections", (done) => {
    const firstClient = ioc("http://localhost:8085");
    const secondClient = ioc("http://localhost:8085");
    const thirdClient = ioc("http://localhost:8085");

    firstClient.on(SOCKET.CREATE_ROOM, (data) => {
      firstClient.emit(SOCKET.CONNECT_ROOM, { token: data.token });
      secondClient.emit(SOCKET.CONNECT_ROOM, { token: data.token });
      thirdClient.emit(SOCKET.CONNECT_ROOM, { token: data.token });
    });

    clientSocket.on(SOCKET.CONNECT_ROOM, (data) => {
      expect(data.connections).toBe(2);
    });

    firstClient.on(SOCKET.ERROR, (err) => {
      expect(JSON.stringify(err)).toBe(
        JSON.stringify(ERROR.TOO_MANY_CONNECTIONS)
      );
      firstClient.disconnect();
      done();
    });

    secondClient.on(SOCKET.ERROR, (err) => {
      expect(JSON.stringify(err)).toBe(
        JSON.stringify(ERROR.TOO_MANY_CONNECTIONS)
      );
      secondClient.disconnect();
      done();
    });

    thirdClient.on(SOCKET.ERROR, (err) => {
      expect(JSON.stringify(err)).toBe(
        JSON.stringify(ERROR.TOO_MANY_CONNECTIONS)
      );
      thirdClient.disconnect();
      done();
    });

    firstClient.emit(SOCKET.CREATE_ROOM);
  });

  test("should decrement number of connections", (done) => {
    const firstClient = ioc("http://localhost:8085");
    const secondClient = ioc("http://localhost:8085");
    const thirdClient = ioc("http://localhost:8085");

    firstClient.on(SOCKET.CREATE_ROOM, (data) => {
      firstClient.emit(SOCKET.CONNECT_ROOM, { token: data.token });
      secondClient.emit(SOCKET.CONNECT_ROOM, { token: data.token });
      thirdClient.emit(SOCKET.CONNECT_ROOM, { token: data.token });
    });

    firstClient.on(SOCKET.CONNECT_ROOM, () => {
      firstClient.disconnect();
      done();
    });

    secondClient.on(SOCKET.CONNECT_ROOM, () => {
      secondClient.disconnect();
      done();
    });

    thirdClient.on(SOCKET.CONNECT_ROOM, () => {
      thirdClient.disconnect();
      done();
    });

    clientSocket.on(SOCKET.CONNECT_ROOM, (data) => {
      expect(data.connections).toBe(2);
      done();
    });

    firstClient.emit(SOCKET.CREATE_ROOM);
  });
});
