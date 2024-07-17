import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";

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

describe("tests for app", () => {
  test("[GET] /nueva", async () => {
    const response = await api.get("/nueva").set("api", "123");
    expect(response.headers["api"]).toBe("123");
    expect(response.statusCode).toBe(200);
  });

  test("[GET] /", async () => {
    const response = await api.get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Hello World" });
  });
});
