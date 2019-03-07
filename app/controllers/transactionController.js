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

      if (amountToTransfer <= 0 || cpfReceived === '' || nameReceived === '') return res.status(400).json({ error: 'Invalid fields has sent' });

      if (creditCardId === '0') {
        return res.status(400).json({ error: 'Invalid credit card' });
      }

      // check if amount to transfer is > than 1000
      if (amountToTransfer > 1000 && !password) {
        return res.status(400).json({ error: 'Greater than 1000 Needs password' });
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
        return res.status(400).json({ error: 'Without balance , use credit card to finish' });
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
        return res.status(400).json({ error: 'Check name and cpf of the destination' });
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
          return res.status(400).json({ error: 'Credit card not found' });
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

      /**
       * If there is a previous transfer,
       * it verifies the time elapsed between it and the current one
       */
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

        /**
         * if the duration between, is less than 2 minutes and the data is the same.
         * Cancels the previous transaction and proceeds to register the current transaction.
         */
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

      /** If the transaction was not duplicated,
       *  the previous one has already been deleted and the current one
       *  will be retained.
       *  And the client funds will not be changed
       *  as they have already been changed
       *  in the excluded transaction.
       */
      if (!duplicated) {
        /**
         *  Update received client balance
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

        const socketToUpdate = req.app.clientList.find(x => x.id === receivedClient.id);

        if (socketToUpdate) {
          try {
            req.app.io.to(socketToUpdate.socketId).emit('balanceUpdate');
          } catch (err) {
            // console.log(err);
          }
        }

        if (!needCreditCard) {
          /**
           *  Update Origin client balance
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

      // Finish transaction
      await Transaction.create({
        clientReceivedId: receivedClient.id,
        clientOriginId: originClient.id,
        amount: amountToTransfer.toFixed(2),
        creditCardId: needCreditCard ? creditCard.id : null,
      });

      return res.json({ msg: 'Transfer Sent', clientid: receivedClient.id });
    } catch (err) {
      return next();
    }
  },

  async showSend(req, res, next) {
    try {
      const transaction = await Transaction.findAll({
        include: [
          {
            model: Client,
            as: 'clientReceived',
            required: true,
            attributes: ['name', 'cpf'],
          },
        ],
        where: {
          clientOriginId: req.clientId,
        },
        order: [['createdAt', 'DESC']],
        attributes: [
          'id',
          'clientOriginId',
          'clientReceivedId',
          'amount',
          'createdAt',
          'creditCardId',
        ],
        raw: true,
      });

      return transaction.count === 0
        ? res.status(400).json({ msg: 'No transfers have been sent to your account' })
        : res.json(transaction);
    } catch (err) {
      return next();
    }
  },

  async showReceived(req, res, next) {
    try {
      const transaction = await Transaction.findAll({
        include: [
          {
            model: Client,
            as: 'clientOrigin',
            required: true,
            attributes: ['name', 'cpf'],
          },
        ],
        where: {
          clientReceivedId: req.clientId,
        },
        attributes: ['id', 'clientOriginId', 'clientReceivedId', 'amount', 'createdAt'],
        raw: true,
      });

      return transaction.count === 0
        ? res.status(400).json({ msg: 'No transfers were made on your account' })
        : res.json(transaction);
    } catch (err) {
      return next();
    }
  },
};
