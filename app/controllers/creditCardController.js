const { CreditCard } = require("../models");
const { checkStr, checkNum } = require("../../config/util");

module.exports = {
  async create(req, res, next) {
    try {
      const { cardNumber } = req.body;

      if (checkStr(cardNumber) || checkNum(cardNumber)) {
        return res
          .status(400)
          .json({ error: "Invalid card number, send only digits" });
      }

      if (
        await CreditCard.findOne({
          where: { cardNumber, clientId: req.clientId }
        })
      ) {
        return res.status(400).json({ error: "Card already exists" });
      }

      const creditCard = await CreditCard.create({
        cardNumber,
        clientId: req.clientId
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
          clientId: req.clientId
        },
        order: [["createdAt", "DESC"]],
        attributes: ["id", "cardNumber", "createdAt"],
        raw: true
      });

      return creditCards.count === 0
        ? res.json({ msg: "no credit cards" })
        : res.json(creditCards.rows);
    } catch (err) {
      return next();
    }
  },

  async update(req, res, next) {
    try {
      const { cardNumber, id } = req.body;
      const creditCard = await CreditCard.update(
        { cardNumber },
        { where: { id, clientId: req.clientId } }
      );

      return creditCard === 0
        ? res.status(400).json({ error: "Not found" })
        : res.json({ success: "Credit Card updated" });
    } catch (err) {
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      const creditCard = await CreditCard.destroy({
        where: { id: req.params.id, clientId: req.clientId }
      });

      return creditCard === 0
        ? res.status(400).json({ error: "Not Deleted" })
        : res.json({ success: "Credit Card deleted" });
    } catch (err) {
      return next();
    }
  }
};
