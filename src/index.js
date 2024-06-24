import express from "express";
import cors from "cors";
import sequelize from "./libs/sequelize.js";
import routerApi from "./routes/index.js";
import "./db/models/associations.js";
import {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} from "./middlewares/error.handler.js";
import { checkApiKey } from "./middlewares/auth.handler.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
import "./utils/auth/index.js"

app.get("/nueva", checkApiKey, (_req, res) => {
  return res.send("Hola mi server en express");
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, async () => {
  try {
    console.log("Mi port" + port);
    await sequelize.authenticate();
    // await sequelize.sync({ force: true });
  } catch (error) {
    console.log("error al cargar servidor", error);
  }
});
