module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('Clients', 'balance', {
    allowNull: false,
    type: DataTypes.STRING,
  }),
};
