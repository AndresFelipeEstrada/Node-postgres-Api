import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";

let server;

beforeAll(async () => {
  server = app.listen();
  await sequelize.authenticate();
});

afterAll(async () => {
  await server.close(); // Cierra el servidor después de las pruebas
  await sequelize.close(); // Cierra la conexión de sequelize
});

const api = request(app);

describe("tests for app", () => {
  test("get /", async () => {
    const response = await api.get("/nueva").set("api", "123");
    expect(response.headers["api"]).toBe("123");
    expect(response.statusCode).toBe(200);
  });
});
