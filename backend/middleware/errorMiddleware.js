const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Not Found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error for debugging
  console.error('Error:', err);

  // Convert known errors to ApiError
  if (err.code === '23505') {
    error = ApiError.conflict('Resource already exists');
  }

  if (err.code === 'PGRST116') {
    error = ApiError.notFound('Resource not found');
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    error = ApiError.badRequest('Validation Error', messages);
  }

  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  }

  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || null,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
