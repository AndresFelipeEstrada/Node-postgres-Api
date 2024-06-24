import boom from "@hapi/boom";
import { Op } from "sequelize";
import { Product } from "../db/models/product.model.js";

class ProductsService {
  constructor() {}

  async create(data) {
    const newProduct = await Product.create(data);
    return newProduct;
  }

  async find({ limit, offset, price, price_min, price_max }) {
    const options = {
      include: ["category"],
      where: {},
    };

    if (limit && offset) {
      (options.limit = limit), (options.offset = offset);
    }

    if (price) options.where.price = price;

    if (price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
    }

    const allProducts = await Product.findAll(options);
    return allProducts;
  }

  async findOne(id) {
    const product = await Product.findByPk(id);

    if (!product) throw boom.notFound("product not found");
    return product;
  }

  async update(id, changes) {
    return { id, changes };
  }

  async delete(id) {
    return id;
  }
}

export default ProductsService;
