import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";
import { User } from "../src/db/models/user.model";
import { downSeed, upSeed } from "./utils/umzug.js";

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

describe("[GET] /my-orders", () => {
  let token;

  beforeAll(async () => {
    const user = await User.findByPk(1);

    const inputData = {
      email: user.email,
      password: "admin123",
    };

    const { body } = await api.post("/api/v1/auth/login").send(inputData);
    token = body.token;
  });

  afterAll(() => (token = null));

  test("should return 401", async () => {
    const { statusCode } = await api.get(`/api/v1/profile/my-orders`).set({
      authorization: `Bearer 123`,
    });

    expect(statusCode).toBe(401);
  });

  test("should return a user with access token valid", async () => {
    const { statusCode } = await api.get(`/api/v1/profile/my-orders`).set({
      authorization: `Bearer ${token}`,
    });

    expect(statusCode).toBe(200);
  });
});
