const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getPropertyBookings,
  approveBooking,
  rejectBooking,
  submitVacateNotice,
  scheduleInspection,
  renewLease,
  getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { bookingValidation } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Get bookings
router.get('/', authorize('admin', 'manager', 'landlord'), getAllBookings);
router.get('/my-bookings', getUserBookings);
router.get('/property/:propertyId', getPropertyBookings);
router.get('/stats', authorize('admin', 'manager'), getBookingStats);
router.get('/:id', getBookingById);

// Create booking
router.post('/', validate(bookingValidation.create), createBooking);

// Update booking
router.put('/:id', updateBooking);

// Admin/Landlord actions
router.put('/:id/approve', authorize('admin', 'manager', 'landlord'), approveBooking);
router.put('/:id/reject', authorize('admin', 'manager', 'landlord'), rejectBooking);
router.put('/:id/vacate-notice', submitVacateNotice);
router.put('/:id/schedule-inspection', authorize('admin', 'manager', 'landlord'), scheduleInspection);
router.put('/:id/renew', renewLease);

// Delete booking (Admin only)
router.delete('/:id', authorize('admin'), deleteBooking);

module.exports = router;
