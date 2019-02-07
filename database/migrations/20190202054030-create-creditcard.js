module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("CreditCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      cardNumber: {
        allowNull: false,
        type: DataTypes.STRING
      },
      clientId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: "clients", key: "id" }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }),

  down: queryInterface => queryInterface.dropTable("CreditCards")
};
