const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_VIDEO_SIZE = parseInt(process.env.MAX_VIDEO_SIZE || `${200 * 1024 * 1024}`); 
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads', 'videos');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('video/')) {
    return cb(new Error('Sólo archivos de vídeo permitidos'), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE }
});

module.exports = upload;