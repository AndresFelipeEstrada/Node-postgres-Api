import { DataTypes } from "sequelize";
import sequelize from "../../libs/sequelize.js";

const ORDER_TABLE = "orders";

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  customerId: {
    field: "customer_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    References: {
      model: "customers",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: DataTypes.NOW,
  },
  total: {
    type: DataTypes.VIRTUAL,
  },
};

const Order = sequelize.define(ORDER_TABLE, OrderSchema);

export { Order, ORDER_TABLE, OrderSchema };
