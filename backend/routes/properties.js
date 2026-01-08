const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  getPropertyUnits,
  addPropertyUnit,
  updatePropertyUnit,
  deletePropertyUnit,
  getPropertyStats,
  uploadPropertyPhotos
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { propertyValidation } = require('../middleware/validation');
const { uploadPropertyPhotos: uploadMiddleware } = require('../middleware/upload');

// Public routes
router.get('/', getAllProperties);
router.get('/search', searchProperties);
router.get('/:id', getPropertyById);
router.get('/:id/units', getPropertyUnits);

// Protected routes
router.use(protect);

// Landlord/Admin/Manager routes
router.post('/', authorize('landlord', 'admin', 'manager'), validate(propertyValidation.create), createProperty);
router.put('/:id', authorize('landlord', 'admin', 'manager'), validate(propertyValidation.update), updateProperty);
router.delete('/:id', authorize('landlord', 'admin', 'manager'), deleteProperty);
router.post('/:id/units', authorize('landlord', 'admin', 'manager'), addPropertyUnit);
router.put('/:id/units/:unitId', authorize('landlord', 'admin', 'manager'), updatePropertyUnit);
router.delete('/:id/units/:unitId', authorize('landlord', 'admin', 'manager'), deletePropertyUnit);
router.post('/:id/upload-photos', authorize('landlord', 'admin', 'manager'), uploadMiddleware, uploadPropertyPhotos);

// Stats (Admin/Manager only)
router.get('/stats/overview', authorize('admin', 'manager'), getPropertyStats);

module.exports = router;
