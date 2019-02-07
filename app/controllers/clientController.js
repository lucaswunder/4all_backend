const { checkStr } = require("../../config/util");
const { Client } = require("../models");

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
      const client = await Client.findByPk(req.clientId, {
        attributes: ["id", "balance", "name", "cpf"]
      });

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
