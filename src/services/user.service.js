import { User } from "../db/models/user.model.js";
import boom from "@hapi/boom";

class UserService {
  constructor() { }

  async create(data) {
    const { email, password } = data

    const isUserExist = await User.findOne({ where: { email } })

    if (isUserExist) throw boom.conflict('El usuario ya existe')

    const createdUser = await User.create({ email, password });
    delete createdUser.dataValues.password
    return createdUser;
  }

  async find() {
    const rta = await User.findAll({
      include: ["customer"],
    });
    return rta;
  }

  async findByEmail(email) {
    const rta = await User.findOne({
      where: { email }
    });
    return rta;
  }

  async findOne(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw boom.notFound("user not found");
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

export default UserService;
