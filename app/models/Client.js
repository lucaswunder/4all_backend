const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      name: DataTypes.STRING,
      cpf: DataTypes.STRING,
      password: DataTypes.STRING,
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

  // eslint-disable-next-line func-names
  Client.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  Client.prototype.generateToken = function generateToken() {
    return jwt.sign({ id: this.id }, authConfig.secret, {
      expiresIn: 86400,
    });
  };

  return Client;
};
