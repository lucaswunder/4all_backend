const { checkStr } = require("../../config/util");
const { Client, CreditCard, Favored } = require("../models");

module.exports = {
  async showBalance(req, res, next) {
    try {
      const client = await Client.findByPk(req.clientId, {
        attributes: ["id", "balance", "name"]
      });

      if (!client) {
        return res.status(400).json("Not found");
      }

      return res.json({ balance: Number(client.balance) });
    } catch (err) {
      return next();
    }
  },

  async show(req, res, next) {
    try {
      const client2 = await Client.findByPk(req.clientId, {
        attributes: ["id", "balance", "name", "cpf", "fone"],
        raw: true
      });

      const creditCards = await CreditCard.count({
        where: { clientId: req.clientId }
      });

      const favoreds = await Favored.count({
        where: { clientId: req.clientId }
      });

      const client = { ...client2, creditCards, favoreds };

      console.log(client);
      if (!client) {
        return res.status(400).json("Not found");
      }

      return res.json(client);
    } catch (err) {
      return next();
    }
  },

  async update(req, res, next) {
    try {
      const { fone, balance } = req.body;

      if (checkStr(fone) || fone.length > 11) {
        return res
          .status(400)
          .json({ error: "Invalid fone number, send only digits" });
      }

      const client = await Client.update(
        { fone, balance },
        { where: { id: req.clientId } }
      );

      return client > 0
        ? res.json({ msg: "Updated" })
        : res.status(400).json({ error: "Not Updated" });
    } catch (err) {
      return next();
    }
  }
};
