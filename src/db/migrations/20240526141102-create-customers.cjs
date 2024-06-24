"use strict";

import { DataTypes } from "sequelize";
import { USER_TABLE } from "../models/user.model";


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn(USER_TABLE, 'recovery_token', {
      field: 'recovery_token',
      allowNull: true,
      type: DataTypes.STRING,
    },);
  },

  async down(queryInterface) {
    await queryInterface.drop(USER_TABLE);
  },
};
