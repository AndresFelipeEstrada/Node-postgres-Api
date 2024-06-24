import boom from "@hapi/boom";
import { Order } from "../db/models/order.model.js";
import { Customer } from "../db/models/customer.model.js";
import { User } from "../db/models/user.model.js";
import { OrderProduct } from "../db/models/order-product.js";
import { Product } from "../db/models/product.model.js";

class OrderService {
  constructor() { }

  async create(data) {
    const newOrder = await Order.create(data);
    return newOrder;
  }

  async findAll() {
    return await Order.findAll();
  }

  async findByUser(id) {
    const orders = await Order.findAll({
      where: {
        '$customer.user.id$': id
      },
      include: [
        {
          association: 'customer',
          include: ['user']
        },
      ]
    })
    return orders
  }

  async findOne(id) {
    const order = await Order.findByPk(id, {
      attributes: ["id", "customerId"],
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "lastName", "phone"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["email", "role"],
            },
          ],
        },
        {
          model: Product,
          as: "items",
          through: {
            model: OrderProduct,
            attributes: ["amount", "orderId", "productId"],
          },
        },
      ],
    });

    if (!order) throw boom.notFound("order not found");

    if (order.items && order.items.length > 0) {
      order.total = order.items.reduce((total, item) => {
        const orderProduct = item.orders_products || {};
        return total + item.price * orderProduct.amount;
      }, 0);
    }
    return order;
  }

  async addItem(data) {
    const newItem = await OrderProduct.create(data);
    return newItem;
  }
}

export default OrderService;
