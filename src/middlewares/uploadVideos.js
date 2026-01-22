/**
 * @fileoverview Configuración de Multer para la gestión y almacenamiento de archivos de vídeo.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_VIDEO_SIZE = parseInt(process.env.MAX_VIDEO_SIZE || `${200 * 1024 * 1024}`); 
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads', 'videos');

// Asegura la existencia de la carpeta de subidas al arrancar el módulo
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * Configuración del almacenamiento en disco.
 * Define el destino y una estrategia de nombres únicos para evitar colisiones.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

/**
 * Filtro de seguridad para validar el tipo de archivo.
 * @param {Object} req - Request.
 * @param {Object} file - Información del archivo.
 * @param {Function} cb - Callback de Multer.
 */
function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('video/')) {
    return cb(new Error('Sólo archivos de vídeo permitidos'), false);
  }
  cb(null, true);
}

/**
 * Instancia de Multer configurada.
 * * @module upload
 * @description Middleware listo para usar en rutas de Express (ej: upload.single('video')).
 * @property {Object} storage - Motor de almacenamiento en disco.
 * @property {Function} fileFilter - Validador de tipos MIME.
 * @property {Object} limits - Restricciones de tamaño de archivo.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE }
});

module.exports = upload;