const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first (Bearer token)
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Fallback to cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw ApiError.unauthorized('Invalid or expired token.');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User not found.');
    }

    if (user.is_blocked) {
      throw ApiError.forbidden('Your account has been blocked. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
