module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    clientReceivedId: DataTypes.INTEGER,
    clientOriginId: DataTypes.INTEGER,
    amount: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    creditCardId: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE,
  });

  Transaction.associate = (models) => {
    // reditCard.belongsTo(models.Client);
  };

  return Transaction;
};
