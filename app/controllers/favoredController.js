const { checkStr, checkNum } = require('../../config/util');
const { Favored, Client } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const { favoredId } = req.body;

      if (checkStr(favoredId) || checkNum(favoredId)) {
        return res.status(400).json({ error: 'Invalid id' });
      }

      if (await Favored.findOne({ where: { favoredId, clientId: req.clientId } })) {
        return res.status(400).json({ error: 'Favored already exists' });
      }

      const favored = await Favored.create({ clientId: req.clientId, favoredId });

      return res.json(favored);
    } catch (err) {
      return next();
    }
  },

  async show(req, res, next) {
    try {
      const favoreds = await Favored.findAndCountAll({
        include: [
          {
            model: Client,
            on: { '$favored.favoredId$': { $col: 'client.id' } },
            required: true,
            attributes: ['name', 'cpf'],
          },
        ],
        where: {
          clientId: req.clientId,
        },
        attributes: ['id'],
      });
      return favoreds.count === 0
        ? res.json({ msg: 'no favoreds cards' })
        : res.json(favoreds.rows);
    } catch (err) {
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      const favored = await Favored.destroy({
        where: { id: req.params.id, clientId: req.clientId },
      });

      return favored === 0
        ? res.status(400).json({ error: 'Not found' })
        : res.json({ success: 'Favored contact deleted' });
    } catch (err) {
      return next();
    }
  },
};
