const { Favored, Client } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const { favoredId } = req.body;
      if (await Favored.findOne({ where: { favoredId } })) {
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
      const favoreds = await Favored.findAll({
        include: [
          {
            model: Client,
            on: { '$favored.favoredId$': { $col: 'client.id' } },
            required: true,
            attributes: ['id', 'name', 'cpf'],
          },
        ],
        where: {
          clientId: req.clientId,
        },
        attributes: ['id', ['clientId', 'originId']],
      });
      return res.json(favoreds);
    } catch (err) {
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      await Favored.destroy({ where: { id: req.params.id } });

      return res.json({ success: 'Favored deleted' });
    } catch (err) {
      return next();
    }
  },
};
