const { Favored, Client } = require('../models');

module.exports = {
  async create(req, res, next) {
    try {
      const { favoredId } = req.body;

      if (await Favored.findOne({ where: { favoredId } })) {
        return res.status(400).json('Favored already exists');
      }

      const favored = await Favored.create({ originClientId: req.clientId, favoredId: 35 });

      return res.json(favored);
    } catch (err) {
      return next();
    }
  },

  async show(req, res, next) {
    try {
      const favoreds = await Favored.findAll({
        include: [Client],
        where: {
          originClientId: req.clientId,
        },
      });

      return res.json(favoreds);
    } catch (err) {
      console.log(err);
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      await Favored.destroy({ where: { id: req.params.id } });

      return res.json('Favored deleted');
    } catch (err) {
      return next();
    }
  },
};
