const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';

    const result = await User.findAll({ page, limit, search, role, sortBy, sortOrder });
    const users = result.users.map(user => user.toPublicJSON());

    res.status(200).json(
      ApiResponse.success({
        users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    res.status(200).json(ApiResponse.success({ user: user.toPublicJSON() }));
  } catch (error) {
    next(error);
  }
};

const adminUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullname, email, role, isBlocked } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw ApiError.notFound('User not found.');
    }

    if (email && email !== existingUser.email) {
      const emailCheck = await User.findByEmail(email);
      if (emailCheck) {
        throw ApiError.conflict('Email already in use.');
      }
    }

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isBlocked === 'boolean') updateData.is_blocked = isBlocked;

    const updatedUser = await User.updateById(id, updateData);

    res.status(200).json(
      ApiResponse.success({ user: updatedUser.toPublicJSON() }, 'User updated successfully.')
    );
  } catch (error) {
    next(error);
  }
};

const adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      throw ApiError.badRequest('You cannot delete your own account.');
    }

    const user = await User.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    if (user.profile_image_public_id) {
      await deleteImage(user.profile_image_public_id);
    }

    await User.deleteById(id);

    res.status(200).json(ApiResponse.success(null, 'User deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await User.getStats();
    res.status(200).json(ApiResponse.success({ stats }));
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullname } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;

    if (req.file) {
      const currentUser = await User.findById(userId);
      if (currentUser.profile_image_public_id) {
        await deleteImage(currentUser.profile_image_public_id);
      }

      try {
        const uploadResult = await uploadImage(req.file);
        updateData.profile_image = uploadResult.url;
        updateData.profile_image_public_id = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    const updatedUser = await User.updateById(userId, updateData);
    delete updatedUser.password;

    res.status(200).json(
      ApiResponse.success({ user: updatedUser.toPublicJSON() }, 'Profile updated successfully.')
    );
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId, true);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Current password is incorrect.');
    }

    const bcrypt = require('bcryptjs');
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await User.updateById(userId, { password: hashedPassword });

    res.status(200).json(ApiResponse.success(null, 'Password changed successfully.'));
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user.profile_image_public_id) {
      await deleteImage(user.profile_image_public_id);
    }

    await User.deleteById(userId);
    res.clearCookie('token');

    res.status(200).json(ApiResponse.success(null, 'Account deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser,
  getStats,
  updateProfile,
  changePassword,
  deleteAccount
};
