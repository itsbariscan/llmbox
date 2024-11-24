const multer = require('multer');
const path = require('path');
const { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } = require('../config/constants');
const { AppError } = require('./errorHandler');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const fileType = SUPPORTED_FILE_TYPES[ext];

  if (!fileType) {
    cb(new AppError(`Unsupported file type: ${ext}`, 400), false);
    return;
  }

  // Check MIME type
  if (file.mimetype !== fileType.mimeType) {
    cb(new AppError('Invalid file type', 400), false);
    return;
  }

  // Add file type to request for later use
  file.fileType = fileType.type;
  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

// Middleware for handling different types of uploads
const uploadHandlers = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),

  // Multiple files upload
  multiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),

  // Mixed files upload (different fields)
  mixed: (fields) => upload.fields(fields),

  // Handle image uploads with additional processing
  image: (fieldName) => [
    upload.single(fieldName),
    async (req, res, next) => {
      if (!req.file) {
        next();
        return;
      }

      try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          // Add image-specific processing here if needed
          req.file.isImage = true;
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  ],

  // Handle code file uploads
  code: (fieldName) => [
    upload.single(fieldName),
    async (req, res, next) => {
      if (!req.file) {
        next();
        return;
      }

      try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        if (['.js', '.py', '.java', '.cpp', '.html', '.css', '.json'].includes(ext)) {
          req.file.isCode = true;
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  ],

  // Handle data file uploads
  data: (fieldName) => [
    upload.single(fieldName),
    async (req, res, next) => {
      if (!req.file) {
        next();
        return;
      }

      try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        if (['.csv', '.xml', '.yaml', '.json'].includes(ext)) {
          req.file.isData = true;
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  ]
};

module.exports = uploadHandlers;