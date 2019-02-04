module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Transactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    clientReceivedId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'clients', key: 'id' },
    },
    clientOriginId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'clients', key: 'id' },
    },
    amount: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),

  down: queryInterface => queryInterface.dropTable('Transactions'),
};
