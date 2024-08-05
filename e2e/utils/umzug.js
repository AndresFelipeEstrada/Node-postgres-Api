import { Umzug, SequelizeStorage } from "umzug";
import sequelize from "../../src/libs/sequelize";

const umzug = new Umzug({
  migrations: { glob: "./src/db/seeders/*.cjs" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});

export const upSeed = async () => {
  try {
    await sequelize.sync({ force: true });
    await umzug.up();
  } catch (e) {
    console.error(e);
  }
};

export const downSeed = async () => {
  await sequelize.drop();
};
