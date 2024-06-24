import { DataTypes } from "sequelize";
import sequelize from "../../libs/sequelize.js";
import { hashPassword } from "../../libs/bcrypt.js";

const USER_TABLE = "users";

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: "customer",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "createAt",
    defaultValue: DataTypes.NOW,
  },
};

const User = sequelize.define(USER_TABLE, UserSchema, {
  hooks: {
    beforeCreate: async (user) => {
      const password = await hashPassword(user.password)
      user.password = password
    },
  }
});

export { USER_TABLE, UserSchema, User };
