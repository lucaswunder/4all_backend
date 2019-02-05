module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define('CreditCard', {
    cardNumber: { type: DataTypes.STRING },
    clientId: { type: DataTypes.INTEGER },
  });

  CreditCard.associate = (models) => {
    CreditCard.belongsTo(models.Client);
  };

  return CreditCard;
};
