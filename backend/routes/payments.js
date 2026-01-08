const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getUserPayments,
  getPropertyPayments,
  initiateMpesaPayment,
  processMpesaCallback,
  verifyPayment,
  generateReceipt,
  getPaymentStats,
  getOverduePayments,
  sendPaymentReminder
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { paymentValidation } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Get payments
router.get('/', authorize('admin', 'manager', 'landlord'), getAllPayments);
router.get('/my-payments', getUserPayments);
router.get('/property/:propertyId', getPropertyPayments);
router.get('/overdue', authorize('admin', 'manager', 'landlord'), getOverduePayments);
router.get('/stats', authorize('admin', 'manager'), getPaymentStats);
router.get('/:id', getPaymentById);
router.get('/:id/receipt', generateReceipt);
router.get('/:id/verify', verifyPayment);

// Create payment
router.post('/', validate(paymentValidation.create), createPayment);

// M-Pesa payments
router.post('/mpesa/stk-push', validate(paymentValidation.mpesaPayment), initiateMpesaPayment);
router.post('/mpesa/callback', processMpesaCallback);

// Update payment
router.put('/:id', updatePayment);

// Reminders
router.post('/:id/send-reminder', authorize('admin', 'manager', 'landlord'), sendPaymentReminder);

// Delete payment (Admin only)
router.delete('/:id', authorize('admin'), deletePayment);

module.exports = router;
