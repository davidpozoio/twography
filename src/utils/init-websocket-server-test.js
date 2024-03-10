const { afterAll } = require("@jest/globals");
const { beforeAll } = require("@jest/globals");
const ioc = require("socket.io-client");

exports.initSocketServer = (port = 8085) => {
  beforeAll((done) => {
    io = require("../io").server(port);
    clientSocket = ioc("http://localhost:8085");
    clientSocket.on("connect", done);
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });
};
