const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../../config/auth');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No tokens provided' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).json({ error: 'token error' });
  }

  const [scheme, token] = parts;

  if (scheme !== 'Bearer') {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.clientId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token Invalid' });
  }
};
