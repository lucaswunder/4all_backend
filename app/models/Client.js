module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  return Client;
};
