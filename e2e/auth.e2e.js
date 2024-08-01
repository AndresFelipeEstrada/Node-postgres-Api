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

describe("tests for auth", () => {
  describe("[POST] /login", () => {
    test("should return 401", async () => {
      const inputData = { email: "emailfake@gmail.com", password: "123456789" };

      const { statusCode } = await api
        .post("/api/v1/auth/login")
        .send(inputData);

      expect(statusCode).toBe(401);
    });

    test("should return 200", async () => {
      const user = await User.findByPk(1);
      const inputData = {
        email: user.email,
        password: "admin12345",
      };

      const { statusCode, body } = await api
        .post("/api/v1/auth/login")
        .send(inputData);

      expect(statusCode).toBe(200);
      expect(body.token).toBeTruthy();
      expect(body.user.email).toEqual(inputData.email);
      expect(body.user.password).toBeUndefined();
    });
  });
});
