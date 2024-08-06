import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";
import { User } from "../src/db/models/user.model";
import { downSeed, upSeed } from "./utils/umzug.js";
import { Category } from "../src/db/models/category.model.js";

describe("test for /categories path", () => {
  let server = null;
  let api = null;
  let token = null;

  beforeAll(async () => {
    server = app.listen(9000);
    api = request(app);
    await upSeed();
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await server.close();
    await downSeed();
    await sequelize.close();
  });

  describe("[POST] /categories with admin user", () => {
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
      const inputData = {
        name: "categoria nueva",
        image: "https://api.lorem.space/image/game?w=150&h=220",
      };
      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .send(inputData);

      expect(statusCode).toBe(401);
    });

    test("should return a new category", async () => {
      const inputData = {
        name: "categoria nueva",
        image: "https://api.lorem.space/image/game?w=150&h=220",
      };
      const { statusCode, body } = await api
        .post(`/api/v1/categories`)
        .set({ authorization: `Bearer ${token}` })
        .send(inputData);

      const category = await Category.findByPk(body.id);

      expect(statusCode).toBe(201);
      expect(category.name).toEqual(inputData.name);
      expect(category.image).toEqual(inputData.image);
    });
  });

  describe("[POST] /categories with customer user", () => {
    beforeAll(async () => {
      const user = await User.findByPk(2);

      const inputData = {
        email: user.email,
        password: "customer123",
      };

      const { body } = await api.post("/api/v1/auth/login").send(inputData);
      token = body.token;
    });

    afterAll(() => (token = null));

    test("should return 401 without token", async () => {
      const inputData = {
        name: "Categoria nueva",
        image: "https://api/lorem.space/image/game?w=150&h=220",
      };

      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .send(inputData);
      expect(statusCode).toBe(401);
    });

    test("should return a new category", async () => {
      const inputData = {
        name: "categoria nueva",
        image: "https://api.lorem.space/image/game?w=150&h=220",
      };
      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .set({ authorization: `Bearer ${token}` })
        .send(inputData);

      expect(statusCode).toBe(401);
    });
  });
});
