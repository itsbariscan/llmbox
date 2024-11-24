const logger = require('../utils/logger');
const multer = require('multer');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle payload too large errors
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      status: 'fail',
      error: 'Payload Too Large',
      details: 'The request payload is too large. Please reduce the size.'
    });
  }

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path
  });

  // Handle specific error types
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        error: 'File too large',
        details: 'Maximum file size exceeded'
      });
    }
    return res.status(400).json({
      status: 'fail',
      error: 'File upload error',
      details: err.message
    });
  }

  // Anthropic API errors
  if (err.name === 'AnthropicError') {
    return res.status(500).json({
      status: 'error',
      error: 'AI Service Error',
      details: err.message
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      error: 'Validation Error',
      details: err.message
    });
  }

  // Default error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
      stack: err.stack,
      details: err
    });
  }

  // Production error response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err.message
    });
  }

  // Programming or unknown errors
  return res.status(500).json({
    status: 'error',
    error: 'Something went wrong'
  });
};

module.exports = {
  AppError,
  errorHandler
};