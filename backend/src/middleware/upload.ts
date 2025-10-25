import multer from 'multer'
import { ApiError } from '../types'

// File size limit (20MB default)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '20971520')
const MAX_FILES = parseInt(process.env.MAX_FILES_PER_UPLOAD || '10')

// Allowed image formats
const ALLOWED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
]

// Configure multer to use memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage()

// File filter
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_FORMATS.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new ApiError(
        `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_FORMATS.join(', ')}`,
        400,
        'INVALID_FILE_TYPE'
      ) as any
    )
  }
}

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
})
