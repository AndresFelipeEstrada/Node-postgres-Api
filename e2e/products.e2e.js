import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";
import { downSeed, upSeed } from "./utils/umzug.js";
import { Product } from "../src/db/models/product.model.js";

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

describe("tests for products", () => {
  test("should return a products", async () => {
    const products = await Product.findAll({});

    const { body, statusCode } = await api.get(`/api/v1/products/`);

    expect(statusCode).toBe(200);
    expect(body.length).toEqual(products.length);
    expect(body[0].category).toBeTruthy();
  });

  test("should return 2 products", async () => {
    const limit = 2;
    const offset = 0;

    const { body, statusCode } = await api.get(
      `/api/v1/products?limit=${limit}&offset=${offset}`,
    );

    expect(statusCode).toBe(200);
    expect(body.length).toEqual(2);
    expect(body[0].category).toBeTruthy();
  });
});
