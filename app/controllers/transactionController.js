const { Transaction, Client } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const {
        amountToTransfer, clientReceivedId, cpfReceived, nameReceived,
      } = req.body;
      if (
        !(await Client.findOne({
          where: { cpf: cpfReceived, name: nameReceived },
        }))
      ) {
        return res.status(400).json('Verify Name and CPF');
      }
      const originClientBalance = await Client.findByPk(req.clientId, {
        attributes: ['balance'],
      });

      if (amountToTransfer <= originClientBalance) {
        return res.status(400).json({ error: 'without balance' });
      }

      return res.json(originClientBalance);
    } catch (err) {
      console.log(err);
      return next();
    }
  },
};
