import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";
import config from "../src/config/config";

let server;

beforeAll(async () => {
  server = app.listen();
  await sequelize.authenticate();
});

afterAll(async () => {
  await server.close();
  await sequelize.close();
});

const api = request(app);

describe("tests for app index", () => {
  test("[GET] /", async () => {
    const response = await api.get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Hello World" });
  });

  describe("[GET] /nueva", () => {
    test("should return 401", async () => {
      const { statusCode } = await api.get("/nueva");

      expect(statusCode).toBe(401);
    });

    test("should return 200", async () => {
      const response = await api.get("/nueva").set({ api: config.apiKey });

      expect(response.headers["api"]).toBe("123");
      expect(response.statusCode).toBe(200);
    });
  });
});
