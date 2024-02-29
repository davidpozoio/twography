const request = require("supertest");
const app = require("../app");

describe("Get /", () => {
  test("should get index.html", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
