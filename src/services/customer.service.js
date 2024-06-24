import { Customer } from "../db/models/customer.model.js";
import boom from "@hapi/boom";
import { User } from "../db/models/user.model.js";
import { hashPassword } from "../libs/bcrypt.js";

class CustomerService {
  constructor() { }

  async find() {
    const rta = await Customer.findAll({
      include: {
        model: User,
        as: "user",
      },
    });
    return rta;
  }

  async findOne(id) {
    const user = await Customer.findByPk(id);

    if (!user) throw boom.notFound("customer not found");

    return user;
  }

  async create(data) {
    const hashedPassword = await hashPassword(data.user.password)
    const newCustomerData = {
      ...data,
      user: {
        ...data.user,
        password: hashedPassword

      }
    }
    const newCustomer = await Customer.create(newCustomerData, { include: ["user"] });
    delete newCustomer.dataValues.user.dataValues.password
    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await Customer.update(changes);

    return rta;
  }

  async delete(id) {
    await this.findOne(id);
    await Customer.destroy();
    return { rta: true };
  }
}

export default CustomerService;
