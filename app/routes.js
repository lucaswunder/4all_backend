const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();
const authMiddleware = require('./middlewares/auth');
// const balanceMiddleware = require('./middlewares/balance');

const controllers = requireDir('./controllers');

/**
 * AUTH
 */

routes.post('/signup', controllers.authController.signup);
routes.post('/login', controllers.authController.login);

/**
 * AUTH ROUTES
 */

routes.use(authMiddleware);

/**
 *  CLIENT
 */

routes.get('/account/client/balance', controllers.clientController.showBalance);
routes.get('/account/client', controllers.clientController.show);
routes.put('/account/client', controllers.clientController.update);

/**
 * CREDIT CARD
 */

routes.post('/account/creditcard', controllers.creditCardController.create);
routes.get('/account/creditcard', controllers.creditCardController.show);
routes.delete('/account/creditcard/:id', controllers.creditCardController.destroy);
routes.put('/account/creditcard', controllers.creditCardController.update);

/**
 * FAVOREDS CONTACTS
 */

routes.post('/account/favored', controllers.favoredController.create);
routes.get('/account/favored', controllers.favoredController.show);
routes.delete('/account/favored/:id', controllers.favoredController.destroy);

/**
 * TRANSACTIONS
 */

routes.post('/account/transaction', controllers.transactionController.create);
routes.get('/account/transaction/send', controllers.transactionController.showSend);
routes.get('/account/transaction/received', controllers.transactionController.showReceived);

/**
 * ROUTE NOT FOUND
 */

routes.use('/*', (req, res) => {
  res.status(404).json('Not found');
});

module.exports = routes;
