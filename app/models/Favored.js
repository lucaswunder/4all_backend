module.exports = (sequelize) => {
  const Favored = sequelize.define('Favored');

  Favored.associate = (models) => {
    Favored.belongsTo(models.Client, { foreingKey: 'favoredId' });
    // Favored.belongsTo(models.Client, { foreingKey: 'clientId' });
  };

  return Favored;
};
