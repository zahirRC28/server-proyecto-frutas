const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const { check, body } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');

const {
  crearUnReporte,
  listarReportes,
  verReporte,
  editarReporte,
  eliminarUnReporte
} = require('../controllers/reporte.controller');

router.post(
  '/crear',
  [
    verificarRol(['Productor']),
    check('titulo')
      .notEmpty().withMessage('Se necesita título')
      .isLength({ max: 150 }).withMessage('El título no puede exceder 150 caracteres'),
    check('id_cultivo')
      .notEmpty().withMessage('Se necesita id_cultivo')
      .isInt().withMessage('id_cultivo debe ser un número entero'),
    body('descripcion')
      .optional()
      .isLength({ max: 5000 }).withMessage('La descripción no puede exceder 5000 caracteres'),
    checksValidaciones
  ],
  crearUnReporte
);

router.get(
  '/',
  verificarRol(['Productor', 'Manager', 'Asesor','Administrador']),
  listarReportes
);

router.get(
  '/:id',
  verificarRol(['Productor', 'Manager', 'Asesor','Administrador']),
  [
    check('id').isInt().withMessage('El id del reporte debe ser un número entero'),
    checksValidaciones
  ],
  verReporte
);

router.put(
  '/editar/:id',
  verificarRol(['Productor','Administrador']),
  [
    check('id').isInt().withMessage('El id del reporte debe ser un número entero'),
    check('titulo')
      .notEmpty().withMessage('Se necesita título')
      .isLength({ max: 150 }).withMessage('El título no puede exceder 150 caracteres'),
    body('descripcion')
      .optional()
      .isLength({ max: 5000 }).withMessage('La descripción no puede exceder 5000 caracteres'),
    checksValidaciones
  ],
  editarReporte
);

router.delete(
  '/eliminar/:id',
  verificarRol(['Productor','Administrador','Manager']),
  [
    check('id').isInt().withMessage('El id del reporte debe ser un número entero'),
    checksValidaciones
  ],
  eliminarUnReporte
);


module.exports = router;
