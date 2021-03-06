module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    clientReceivedId: { type: DataTypes.INTEGER },
    clientOriginId: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    creditCardId: { type: DataTypes.INTEGER },
    updatedAt: { type: DataTypes.DATE },
  });

  Transaction.associate = (models) => {
    // reditCard.belongsTo(models.Client);
    Transaction.belongsTo(models.Client, { as: 'clientReceived', foreingKey: 'clientReceivedId' });
    Transaction.belongsTo(models.Client, { as: 'clientOrigin', foreingKey: 'clientOriginId' });
  };

  return Transaction;
};
