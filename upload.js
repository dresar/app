const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Hanya file gambar (jpg, jpeg, png, webp, gif) yang diizinkan.'));
}

const limits = { fileSize: 5 * 1024 * 1024 };

module.exports = {
  uploadSingle: multer({ storage, fileFilter, limits }).single('photo'),
  uploadMany: multer({ storage, fileFilter, limits }).array('photos', 10),
};
