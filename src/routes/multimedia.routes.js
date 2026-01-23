const express = require('express');
const multer = require('multer');
const path = require('path');
const { check } = require('express-validator');

const { checksValidaciones } = require('../middlewares/checkValidations');
const {
  subirMultimedia,
  listarMultimediaPorEntidad,
  eliminarMultimedia
} = require('../controllers/multimedia.controller');
const { verificarRol } = require('../middlewares/verificarRol');

const router = express.Router();

const storage = multer.memoryStorage();

const allowedExtensions = [
  '.jpg', '.jpeg', '.png', '.webp',
  '.pdf',
  '.mp4', '.mov', '.avi', '.mkv'
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no permitido'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB aunque claudy solo accepta 10MB
  fileFilter
});

router.post(
  '/:entidad/:id',
  [
    verificarRol(['Administrador']),
    upload.single('archivo'),
    check('entidad')
      .isIn(['incidencia', 'reporte', 'cultivo'])
      .withMessage('Entidad no válida'),
    check('id')
      .isInt().withMessage('El id debe ser un entero'),
    checksValidaciones
  ],
  subirMultimedia
);

router.get(
  '/:entidad/:id',
  [
    verificarRol(['Administrador']),
    check('entidad')
      .isIn(['incidencia', 'reporte', 'cultivo'])
      .withMessage('Entidad no válida'),
    check('id')
      .isInt().withMessage('El id debe ser un entero'),
    checksValidaciones
  ],
  listarMultimediaPorEntidad
);

router.delete(
  '/:id_multimedia',
  [
    verificarRol(['Administrador']),
    check('id_multimedia')
      .isInt().withMessage('El id debe ser un entero'),
    checksValidaciones
  ],
  eliminarMultimedia
);

module.exports = router;
