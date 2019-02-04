module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    clientReceivedId: DataTypes.INTEGER,
    clientOriginId: DataTypes.INTEGER,
    amount: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  });

  Transaction.associate = (models) => {
    // CreditCard.belongsTo(models.Client);
  };

  return Transaction;
};
