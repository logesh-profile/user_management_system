const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const { protect } = require('../middleware/authMiddleware');
const { uploadMiddleware, handleUploadError } = require('../middleware/uploadMiddleware');

router.post(
  '/register',
  uploadMiddleware.single('avatar'),
  handleUploadError,
  registerValidation,
  register
);

router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
