import express from "express";
import cors from "cors";
import routerApi from "./routes/index.js";
import "./db/models/associations.js";
import {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} from "./middlewares/error.handler.js";
import { checkApiKey } from "./middlewares/auth.handler.js";

export const app = express();

app.use(express.json());
app.use(cors());
import "./utils/auth/index.js";

app.get("/", (_req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.get("/nueva", checkApiKey, (_req, res) => {
  return res.status(200).send("Hola mi server en express");
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);
