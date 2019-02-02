const { CreditCard } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const { cardNumber } = req.body;

      if (await CreditCard.findOne({ where: { cardNumber } })) {
        return res.status(400).json('Card already exists');
      }

      const creditCard = await CreditCard.create({ ...req.body, clientId: req.clientId });

      return res.json(creditCard);
    } catch (err) {
      return next();
    }
  },

  async show(req, res, next) {
    try {
      const creditCards = await CreditCard.findAll({
        where: {
          clientId: req.clientId,
        },
      });

      return res.json(creditCards);
    } catch (err) {
      console.log(err);
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      await CreditCard.destroy({ where: { id: req.params.id } });

      return res.json('Credit Card deleted');
    } catch (err) {
      return next();
    }
  },
};
