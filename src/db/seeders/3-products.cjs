module.exports = {
  up: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert("products", [
      {
        name: "Product 1",
        image: "https://api.lorem.space/image/game?w=150&h=220",
        description: "ejemplo de descripcion",
        price: 2000,
        created_at: new Date(),
        updatedAt: new Date(),
        category_id: 1,
      },
      {
        name: "Product 2",
        image: "https://api.lorem.space/image/game?w=150&h=220",
        description: "ejemplo de descripcion",
        price: 5000,
        created_at: new Date(),
        updatedAt: new Date(),
        category_id: 2,
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete("products", null, {});
  },
};
