const { describe } = require("@jest/globals");
const { initSocketServer } = require("../utils/init-websocket-server-test");
const { test } = require("@jest/globals");

describe("connect-room socket", () => {
  initSocketServer();
  test("", () => {});
});
