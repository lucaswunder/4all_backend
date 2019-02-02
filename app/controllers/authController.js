const { Client } = require('../models');

module.exports = {
  async login(req, res, next) {
    try {
      const { cpf, password } = req.body;

      const client = await Client.findOne({ where: { cpf } });

      if (!client) {
        return res.status(400).json({ error: 'Client no found' });
      }

      // eslint-disable-next-line
      if (!(await client.checkPassword(password))) {
        return res.status(400).json({ error: 'Invalid' });
      }

      return res.json({ client, token: client.generateToken() });
    } catch (err) {
      return next(err);
    }
  },
  async signup(req, res, next) {
    try {
      const { cpf } = req.body;

      if (await Client.findOne({ where: { cpf } })) {
        return res.status(400).json('Client already exists');
      }

      const client = await Client.create({ ...req.body });

      return res.json({ client, token: client.generateToken() });
    } catch (err) {
      return next(err);
    }
  },
};
