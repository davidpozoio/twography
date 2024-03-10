const { describe, test, expect } = require("@jest/globals");
const { SOCKET } = require("../consts/routes");
const { initSocketServer } = require("../utils/init-websocket-server-test");

describe("io websocket server", () => {
  initSocketServer(8086);
});
