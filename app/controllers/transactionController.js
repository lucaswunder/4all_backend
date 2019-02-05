const moment = require('moment');
const { Transaction, Client, CreditCard } = require('../models');

module.exports = {
  /**
   * Create Transaction
   */
  async create(req, res, next) {
    let needCreditCard = false;
    let needPassword = false;

    try {
      const {
        cpfReceived, nameReceived, creditCardId, password,
      } = req.body;

      const amountToTransfer = Number(req.body.amountToTransfer);

      if (creditCardId === '0') {
        return res.status(400).json({ error: 'Invalid credit card', msg: 'choose another' });
      }
      // check if amount to transfer is > than 1000
      if (amountToTransfer > 1000 && !password) {
        return res.status(400).json({ error: 'Greater than 1000', msg: 'Needs password' });
      }

      needPassword = !!password;

      // Get client info
      const originClient = await Client.findByPk(req.clientId, {
        attributes: ['id', 'balance', 'name', 'password'],
      });

      // because, on the database is String.
      const originClientBalance = Number(originClient.balance);

      needCreditCard = !!(amountToTransfer > originClientBalance);

      // check if the user has enough money
      if (amountToTransfer > originClientBalance && !creditCardId) {
        return res.status(400).json({ error: 'Without balance', msg: 'Use credit card to finish' });
      }

      // If have client info
      if (!originClient) {
        return res.status(400).json({ error: 'Failed to get client information' });
      }

      if (needPassword) {
        // If is a valid password
        if (!(await originClient.checkPassword(password))) {
          return res.status(400).json({ error: 'Invalid password' });
        }
      }

      // Confirms that the sending user has the correct destination account information
      const receivedClient = await Client.findOne({
        where: { cpf: cpfReceived, name: nameReceived },
      });

      // If have info
      if (!receivedClient) {
        return res.status(400).json('Check name and cpf of the destination');
      }

      // Get credit card information
      const creditCard = await CreditCard.findOne({
        where: { id: creditCardId, clientId: originClient.id },
        attributes: ['id', 'cardNumber'],
        raw: true,
      });

      if (creditCard) {
        // If the user not selects a valid credit card
        if (creditCard.id === 'null' || creditCardId === 0) {
          creditCard.id = null;
          return res.status(400).json('Credit card not found');
        }
      }

      // Get Client last transaction
      const lastClientTransaction = await Transaction.findOne({
        where: {
          clientOriginId: originClient.id,
        },
        order: [['id', 'DESC']],
        raw: true,
      });

      let duplicated = false;

      if (lastClientTransaction) {
        const lastClientAmount = Number(lastClientTransaction.amount);

        const transactionTime = moment(lastClientTransaction.createdAt).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        const nowTime = moment().format('YYYY-MM-DDTHH:mm:ss');
        let duration;

        const date1 = moment(transactionTime, 'YYYY-MM-DDTHH:mm:ss');
        const date2 = moment(nowTime, 'YYYY-MM-DDTHH:mm:ss');
        duration = moment.duration(date2.diff(date1));
        // duration = duration.asMinutes();
        duration = 1;

        if (
          duration <= 2
          && lastClientTransaction.clientReceivedId === receivedClient.id
          && lastClientAmount === amountToTransfer
        ) {
          Transaction.destroy({
            where: {
              id: lastClientTransaction.id,
            },
          });
          duplicated = true;
        }
      }

      // Finish transaction
      const registryTransaction = await Transaction.create({
        clientReceivedId: receivedClient.id,
        clientOriginId: originClient.id,
        amount: amountToTransfer.toFixed(2),
        creditCardId: creditCardId ? creditCard.id : null,
      });

      if (!duplicated) {
        /**
         * Update received client balance
         */
        const receivedClientBalance = Number(receivedClient.balance);
        const receivedClientBalanceSum = receivedClientBalance + amountToTransfer;
        // Increment balance
        await receivedClient.update(
          {
            balance: receivedClientBalanceSum.toFixed(2),
          },
          { fields: ['balance'] },
        );

        if (!needCreditCard) {
          /**
           * Update Origin client balance
           */
          const newOriginClientBalance = originClientBalance - amountToTransfer;
          // decrement balance
          await originClient.update(
            {
              balance: newOriginClientBalance.toFixed(2),
            },
            { fields: ['balance'] },
          );
        }
      }

      return res.json({ registryTransaction });
    } catch (err) {
      return next();
    }
  },

  async show(req, res, next) {
    try {
      const transactions = await Transaction.findAll({
        where: {
          clientOriginId: req.clientId,
        },
        order: [['id', 'DESC']],
        raw: true,
      });

      return res.json(transactions);
    } catch (err) {
      console.log(err);
      return next();
    }
  },
};
