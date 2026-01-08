const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  searchUsers,
  getUserBookings,
  getUserPayments,
  getUserAlerts
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin/Manager only routes
router.get('/', authorize('admin', 'manager'), getAllUsers);
router.get('/stats', authorize('admin', 'manager'), getUserStats);
router.get('/search', authorize('admin', 'manager'), searchUsers);

// User-specific routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.get('/:id/bookings', getUserBookings);
router.get('/:id/payments', getUserPayments);
router.get('/:id/alerts', getUserAlerts);

module.exports = router;
