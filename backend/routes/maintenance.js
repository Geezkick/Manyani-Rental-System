const express = require('express');
const router = express.Router();
const {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getUserMaintenance,
  getPropertyMaintenance,
  assignMaintenance,
  updateStatus,
  addUpdate,
  addFeedback,
  scheduleRecurring,
  getMaintenanceStats
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');
const { uploadMaintenancePhotos } = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Get maintenance requests
router.get('/', getAllMaintenance);
router.get('/my-requests', getUserMaintenance);
router.get('/property/:propertyId', getPropertyMaintenance);
router.get('/stats', authorize('admin', 'manager'), getMaintenanceStats);
router.get('/:id', getMaintenanceById);

// Create maintenance request
router.post('/', uploadMaintenancePhotos, createMaintenance);

// Update maintenance request
router.put('/:id', updateMaintenance);

// Maintenance actions
router.put('/:id/assign', authorize('admin', 'manager', 'landlord'), assignMaintenance);
router.put('/:id/status', updateStatus);
router.post('/:id/updates', addUpdate);
router.post('/:id/feedback', addFeedback);
router.post('/:id/schedule-recurring', authorize('admin', 'manager'), scheduleRecurring);

// Delete maintenance request (Admin only)
router.delete('/:id', authorize('admin'), deleteMaintenance);

module.exports = router;
