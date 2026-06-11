const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser,
  getStats,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/userController');
const {
  updateProfileValidation,
  changePasswordValidation,
  adminUpdateUserValidation,
  getUserValidation,
  getUsersValidation
} = require('../validations/user.validation');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { uploadMiddleware, handleUploadError } = require('../middleware/uploadMiddleware');

// Self-service routes (require authentication)
router.put(
  '/profile',
  protect,
  uploadMiddleware.single('avatar'),
  handleUploadError,
  updateProfileValidation,
  updateProfile
);

router.put('/password', protect, changePasswordValidation, changePassword);
router.delete('/account', protect, deleteAccount);

// Admin routes (require authentication + admin role)
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getUsersValidation, getAllUsers);
router.get('/:id', protect, adminOnly, getUserValidation, getUserById);
router.put('/:id', protect, adminOnly, adminUpdateUserValidation, adminUpdateUser);
router.delete('/:id', protect, adminOnly, getUserValidation, adminDeleteUser);

module.exports = router;
