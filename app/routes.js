const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

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
 * CREDIT CARD
 */
routes.post('/account/creditcard', controllers.creditCardController.create);
routes.get('/account/creditcard', controllers.creditCardController.show);
routes.delete('/account/creditcard/:id', controllers.creditCardController.destroy);

/**
 * FAVOREDS CONTACTS
 */
routes.post('/account/favored', controllers.favoredController.create);
routes.get('/account/favored', controllers.favoredController.show);

module.exports = routes;
