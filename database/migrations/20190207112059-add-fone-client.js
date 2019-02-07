module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('Clients', 'fone', {
    allowNull: true,
    type: DataTypes.STRING,
  }),
};
