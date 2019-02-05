module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('Clients', 'balance', {
    type: DataTypes.STRING,
  }),
};
