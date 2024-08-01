import { Category } from "../../src/db/models/category.model";
import { User } from "../../src/db/models/user.model";
import { hashPassword } from "../../src/libs/bcrypt";
import sequelize from "../../src/libs/sequelize";

export const upSeed = async () => {
  try {
    await sequelize.sync({ force: true });
    const password = "admin12345";
    // const hash = await hashPassword(password);
    await User.create({
      email: "admin@gmail.com",
      password,
      role: "admin",
    });
    await Category.bulkCreate([
      {
        name: "Category 1",
        image: "https://api.lorem.space/image/game?w=150&h=220",
      },
      {
        name: "Category 2",
        image: "https://api.lorem.space/image/game?w=150&h=220",
      },
    ]);
  } catch (error) {
    console.error(error);
  }
};

export const downSeed = async () => {
  await sequelize.drop();
};
