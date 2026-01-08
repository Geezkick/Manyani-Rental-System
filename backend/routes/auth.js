const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  uploadProfilePicture,
  uploadNationalId
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { authValidation } = require('../middleware/validation');
const { uploadProfilePicture: uploadProfileMiddleware, uploadNationalId: uploadNationalIdMiddleware } = require('../middleware/upload');

// Public routes
router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(authValidation.updateProfile), updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/upload-profile', protect, uploadProfileMiddleware, uploadProfilePicture);
router.post('/upload-national-id', protect, uploadNationalIdMiddleware, uploadNationalId);
router.post('/logout', protect, logout);

module.exports = router;
