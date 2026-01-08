const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  getUserAlerts,
  getBuildingAlerts,
  markAlertAsRead,
  acknowledgeAlert,
  sendAlert,
  getAlertStats,
  getUpcomingAlerts
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get alerts
router.get('/', getAllAlerts);
router.get('/my-alerts', getUserAlerts);
router.get('/building/:buildingId', getBuildingAlerts);
router.get('/upcoming', getUpcomingAlerts);
router.get('/stats', authorize('admin', 'manager'), getAlertStats);
router.get('/:id', getAlertById);

// Create alert (Admin/Manager/Landlord only)
router.post('/', authorize('admin', 'manager', 'landlord'), createAlert);

// Update alert (Admin/Manager/Landlord only)
router.put('/:id', authorize('admin', 'manager', 'landlord'), updateAlert);

// User actions
router.put('/:id/read', markAlertAsRead);
router.put('/:id/acknowledge', acknowledgeAlert);

// Send alert immediately (Admin/Manager/Landlord only)
router.post('/:id/send', authorize('admin', 'manager', 'landlord'), sendAlert);

// Delete alert (Admin only)
router.delete('/:id', authorize('admin'), deleteAlert);

module.exports = router;
