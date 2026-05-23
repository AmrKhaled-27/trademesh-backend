import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { AppError } from '../../utils/AppError.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new AppError('Only CSV files are allowed', 400), false);
    }
  },
});

export const uploadCsv = upload.single('file');

export const parseCsv = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No CSV file uploaded', 400));
  }

  try {
    const rawContent = req.file.buffer.toString();
    const records = parse(rawContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Handle array fields
    const processedRecords = records.map((record) => {
      if (record.images && typeof record.images === 'string') {
        record.images = record.images.split('|').filter(Boolean);
      } else {
        record.images = [];
      }
      return record;
    });

    req.body.products = processedRecords;
    next();
  } catch (err) {
    next(new AppError('Failed to parse CSV file', 400));
  }
};
