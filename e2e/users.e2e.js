import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";
import { User } from "../src/db/models/user.model";
import { downSeed, upSeed } from "./utils/seed";

let server;

beforeAll(async () => {
  await upSeed();
  server = app.listen();
  await sequelize.authenticate();
});

afterAll(async () => {
  await downSeed();
  await server.close();
  await sequelize.close();
});

const api = request(app);

describe("tests for users", () => {
  describe("[GET] /users/{id}", () => {
    test("should return a user", async () => {
      const user = await User.findByPk("1");

      const { body, statusCode } = await api.get(`/api/v1/users/${user.id}`);

      expect(statusCode).toBe(200);
      expect(body.id).toBe(user.id);
      expect(body.email).toBe(user.email);
    });
  });

  describe("[POST] /users", () => {
    test("should return a 400 Bad Request", async () => {
      const inputData = { email: "", password: "123" };

      const { statusCode, body } = await api
        .post("/api/v1/users")
        .send(inputData);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/password/);
    });
  });

  test("should return a new user", async () => {
    const inputData = { email: "pepito@gmail.com", password: "pepito12345678" };

    const { statusCode, body } = await api
      .post("/api/v1/users")
      .send(inputData);
    expect(statusCode).toBe(201);

    const user = await User.findByPk(body.id);
    expect(user).toBeTruthy();
  });
});
