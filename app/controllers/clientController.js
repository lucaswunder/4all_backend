const { Client } = require('../models');

module.exports = {
  async showBalance(req, res, next) {
    try {
      const client = await Client.findByPk(req.clientId, {
        attributes: ['id', 'balance', 'name'],
      });

      return res.json({ balance: Number(client.balance) });
    } catch (err) {
      return next();
    }
  },
};
