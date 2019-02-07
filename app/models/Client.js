const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      name: { type: DataTypes.STRING },
      cpf: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      balance: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeSave: async (client) => {
          if (client.password) {
            // eslint-disable-next-line no-param-reassign
            client.password = await bcrypt.hash(client.password, 8);
          }
        },
      },
    },
  );

  // Client.associate = (models) => {
  //   // Client.hasMany(models.CreditCard, { foreignKey: 'clientId' });
  //   // Client.hasMany(models.Favored, { foreignKey: 'favoredId' });
  // };

  // eslint-disable-next-line func-names
  Client.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  Client.prototype.generateToken = function generateToken() {
    return jwt.sign({ id: this.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  };

  return Client;
};
