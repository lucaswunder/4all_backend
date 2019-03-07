const { checkStr } = require('../../config/util');

const { Client } = require('../models');

module.exports = {
  async login(req, res, next) {
    try {
      const { cpf, password } = req.body;

      if (checkStr(cpf) || checkStr(password)) {
        res.status(400).json({ error: 'Invalid CPF or Password' });
      }

      const client = await Client.findOne({ where: { cpf } });

      if (!client) {
        return res.status(400).json({ error: 'Client no found' });
      }

      // eslint-disable-next-line
      if (!(await client.checkPassword(password))) {
        return res.status(400).json({ error: 'Client no found' });
      }

      return res.json({
        User: client.name,
        balance: client.balance,
        token: client.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },

  async signup(req, res, next) {
    try {
      const {
        cpf, name, password, fone,
      } = req.body;

      if (checkStr(cpf) || checkStr(name) || checkStr(password)) {
        return res.status(400).json({ error: 'Invalid CPF, Name or Password' });
      }

      if (checkStr(fone) || fone.length > 11) {
        return res.status(400).json({ error: 'Invalid fone number, send only digits' });
      }

      if (await Client.findOne({ where: { cpf } })) {
        return res.status(400).json({ error: 'Client already exists' });
      }

      const client = await Client.create({ ...req.body });

      return res.json({ User: client.name, token: client.generateToken() });
    } catch (err) {
      return next(err);
    }
  },
};
