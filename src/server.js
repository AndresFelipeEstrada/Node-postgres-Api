import { app } from "./index.js";
import sequelize from "./libs/sequelize.js";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    console.log("Escuchando en el puerto: " + port);
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.log("Error al cargar servidor", error);
  }
});
