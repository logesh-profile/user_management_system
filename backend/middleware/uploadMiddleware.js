const multer = require('multer');
const ApiError = require('../utils/ApiError');

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.mimetype)) {
    return next(ApiError.badRequest('Only JPEG, PNG, and WebP images are allowed'));
  }

  next(null, true);
};

const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('File size too large. Maximum size is 5MB'));
    }
    return next(ApiError.badRequest(err.message));
  }
  next(err);
};

module.exports = { uploadMiddleware, handleUploadError };
