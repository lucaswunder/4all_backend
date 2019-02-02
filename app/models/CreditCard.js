module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define('CreditCard', {
    cardNumber: DataTypes.STRING,
  });

  CreditCard.associate = (models) => {
    CreditCard.belongsTo(models.Client);
  };

  return CreditCard;
};
