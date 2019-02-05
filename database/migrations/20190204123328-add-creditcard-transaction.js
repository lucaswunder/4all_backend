module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.addColumn('Transactions', 'creditCardId', {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: { model: 'creditCards', key: 'id' },
  }),
};
