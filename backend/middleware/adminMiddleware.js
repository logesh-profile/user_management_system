const ApiError = require('../utils/ApiError');

const adminOnly = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required.');
  }

  if (req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin access required.');
  }

  next();
};

module.exports = { adminOnly };
