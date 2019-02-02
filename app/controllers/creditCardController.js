const { CreditCard } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const { cardNumber } = req.body;

      if (await CreditCard.findOne({ where: { cardNumber } })) {
        return res.status(400).json('Card already exists');
      }

      const creditCard = await CreditCard.create({ ...req.body, clientId: req.clientId });

      return res.json(`${cardNumber}-${req.clientId}`);
    } catch (err) {
      return next();
    }
  },

  // async destroy(req, res, next) {},
};
