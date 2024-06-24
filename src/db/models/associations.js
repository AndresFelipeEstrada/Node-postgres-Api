import { Customer } from "./customer.model.js";
import { User } from "./user.model.js";
import { Category } from "./category.model.js";
import { Product } from "./product.model.js";
import { Order } from "./order.model.js";
import { OrderProduct } from "./order-product.js";

Customer.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasOne(Customer, { as: "customer", foreignKey: "userId" });
Category.hasMany(Product, { as: "products", foreignKey: "categoryId" });
Product.belongsTo(Category, { as: "category" });
Order.belongsTo(Customer, { as: "customer" });
Customer.hasMany(Order, { as: "orders", foreignKey: "customerId" });
Order.belongsToMany(Product, {
  as: "items",
  through: OrderProduct,
  foreignKey: "orderId",
  otherKey: "productId",
});

export { Customer, User, Category, Product };
