const { CreditCard } = require('../models');
const { checkStr } = require('../../config/util');

module.exports = {
  async create(req, res, next) {
    try {
      const { cardNumber } = req.body;

      if (checkStr(cardNumber)) {
        return res.status(400).json({ error: 'Invalid card number' });
      }

      if (await CreditCard.findOne({ where: { cardNumber }, $or: [req.clientId] })) {
        return res.status(400).json({ error: 'Card already exists' });
      }

      const creditCard = await CreditCard.create({
        cardNumber,
        clientId: req.clientId,
      });

      return res.json(creditCard);
    } catch (err) {
      return next();
    }
  },

  async show(req, res, next) {
    try {
      const creditCards = await CreditCard.findAndCountAll({
        where: {
          clientId: req.clientId,
        },
      });

      return creditCards.count === 0
        ? res.json({ msg: 'no credit cards' })
        : res.json(creditCards.rows);
    } catch (err) {
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      const creditCard = await CreditCard.destroy({
        where: { id: req.params.id, clientId: req.clientId },
      });

      if (creditCard === 0) {
        return res.status(400).json({ error: 'Not found' });
      }

      return res.json({ success: 'Credit Card deleted' });
    } catch (err) {
      return next();
    }
  },
};
