const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { generateToken, sendTokenCookie, clearTokenCookie } = require('../utils/generateToken');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');

const register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('Email is already registered.');
    }

    let profileImage = null;
    let profileImagePublicId = null;

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file);
        profileImage = uploadResult.url;
        profileImagePublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    const user = await User.create({
      fullname,
      email,
      password,
      profileImage,
      profileImagePublicId
    });

    const token = generateToken(user.id);
    sendTokenCookie(res, token);

    res.status(201).json(
      ApiResponse.created({ user: user.toPublicJSON(), token }, 'Registration successful.')
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email, true);
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials.');
    }

    const isPasswordMatch = await User.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw ApiError.unauthorized('Invalid credentials.');
    }

    if (user.is_blocked) {
      throw ApiError.forbidden('Your account has been blocked.');
    }

    await User.updateById(user.id, { last_login: new Date().toISOString() });

    const token = generateToken(user.id);
    sendTokenCookie(res, token);

    const userWithoutPassword = await User.findById(user.id);
    res.status(200).json(
      ApiResponse.success({ user: userWithoutPassword.toPublicJSON(), token }, 'Login successful.')
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    res.status(200).json(ApiResponse.success(null, 'Logged out successfully.'));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    res.status(200).json(ApiResponse.success({ user: user.toPublicJSON() }));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
