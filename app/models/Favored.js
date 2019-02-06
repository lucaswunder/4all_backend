module.exports = (sequelize, DataTypes) => {
  const Favored = sequelize.define('Favored', {
    clientId: { type: DataTypes.INTEGER },
    favoredId: { type: DataTypes.INTEGER },
  });

  Favored.associate = (models) => {
    Favored.belongsTo(models.Client, { foreingKey: 'favoredId' });
    // Favored.belongsTo(models.Client, { foreingKey: 'clientId' });
  };

  return Favored;
};
