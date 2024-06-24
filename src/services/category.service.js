import { Category } from "../db/models/category.model.js";

class CategoryService {
  constructor() {}

  async create(data) {
    const newCategory = await Category.create(data);
    return newCategory;
  }

  async find() {
    const allCategories = await Category.findAll();
    return allCategories;
  }

  async findOne(id) {
    const category = await Category.findByPk(id, { include: ["products"] });
    return category;
  }
  async update(id, changes) {
    return { id, changes };
  }

  async delte(id) {
    return id;
  }
}

export default CategoryService;
