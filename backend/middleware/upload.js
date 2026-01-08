const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    
    if (file.fieldname === 'profilePicture') {
      folder = 'profile-pictures';
    } else if (file.fieldname === 'nationalIdPhoto') {
      folder = 'documents/id-cards';
    } else if (file.fieldname === 'vehiclePhoto') {
      folder = 'documents/vehicles';
    } else if (file.fieldname === 'propertyPhotos') {
      folder = 'properties';
    } else if (file.fieldname === 'paymentProof') {
      folder = 'payments';
    } else if (file.fieldname === 'maintenancePhotos') {
      folder = 'maintenance';
    }
    
    const dir = path.join(uploadDir, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image, PDF, and document files are allowed!'));
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Specific upload configurations
const uploadProfilePicture = upload.single('profilePicture');
const uploadNationalId = upload.single('nationalIdPhoto');
const uploadVehiclePhoto = upload.single('vehiclePhoto');
const uploadPropertyPhotos = upload.array('propertyPhotos', 10);
const uploadPaymentProof = upload.single('paymentProof');
const uploadMaintenancePhotos = upload.array('maintenancePhotos', 5);

// Multiple files upload
const uploadMultiple = (fields) => upload.fields(fields);

// Error handler for uploads
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  uploadProfilePicture,
  uploadNationalId,
  uploadVehiclePhoto,
  uploadPropertyPhotos,
  uploadPaymentProof,
  uploadMaintenancePhotos,
  uploadMultiple,
  handleUploadError
};
