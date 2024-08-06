const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert("users", [
      {
        email: "admin@gmail.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        createAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "customer@gmail.com",
        password: await bcrypt.hash("customer123", 10),
        role: "customer",
        createAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete("users", null, {});
  },
};
