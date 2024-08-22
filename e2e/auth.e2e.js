import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../src";
import sequelize from "../src/libs/sequelize";
import { User } from "../src/db/models/user.model";
import { downSeed, upSeed } from "./utils/umzug.js";

let server;

const mockSendmail = jest.fn();

jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn().mockImplementation(() => {
      return {
        sendMail: mockSendmail,
      };
    }),
  };
});

beforeAll(async () => {
  server = app.listen();
  await upSeed();
  await sequelize.authenticate();
});

afterAll(async () => {
  await server.close();
  await downSeed();
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
        password: "admin123",
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

  describe("[POST] /recovery", () => {
    beforeAll(() => {
      mockSendmail.mockClear();
    });

    test("should return a 401", async () => {
      const inputData = { email: "fakedata@gmail.com" };

      const { statusCode } = await api
        .post("/api/v1/auth/recovery")
        .send(inputData);
      expect(statusCode).toBe(401);
    });

    test("should send email", async () => {
      const user = await User.findByPk(1);
      const inputData = { email: user.email };

      mockSendmail.mockResolvedValue(true);
      const { statusCode, body } = await api
        .post("/api/v1/auth/recovery")
        .send(inputData);
      expect(statusCode).toBe(200);
      expect(body.message).toEqual("email sent");
      expect(mockSendmail).toHaveBeenCalled();
    });
  });
});
