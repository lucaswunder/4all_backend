module.exports = (sequelize) => {
  const Favored = sequelize.define('Favored');

  Favored.associate = (models) => {
    Favored.belongsTo(models.Client, {
      through: models.Favored,
      as: 'favored',
      foreingKey: 'favoredId',
    });
  };

  Favored.associate = (models) => {
    Favored.belongsTo(models.Client, { as: 'originClient' });
  };

  return Favored;
};
