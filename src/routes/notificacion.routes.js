const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const { check, body } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');


const {
  crearNotificacion, 
  obtenerNotificacionesPorCreador, 
  obtenerNotificacionesPorReceptor, 
  obtenerNotificacionesTodas, 
  marcarNotificacionLeida } = require("../controllers/notificacion.controller");

router.post(
  '/crear',
  [
    verificarRol(['Productor','Administrador', 'Manager', 'Asesor']),

    check('tipo')
      .notEmpty().withMessage('Se necesita tipo')
      .isLength({ max: 50 }).withMessage('El tipo no puede exceder 50 caracteres'),

    check('titulo')
      .notEmpty().withMessage('Se necesita título')
      .isLength({ max: 150 }).withMessage('El título no puede exceder 150 caracteres'),

    check('mensaje')
      .notEmpty().withMessage('Se necesita mensaje')
      .isLength({ max: 2000 }).withMessage('El mensaje no puede exceder 2000 caracteres'),

    checksValidaciones
  ],
  crearNotificacion
);

router.get(
  '/por-creador/:id',
  [ verificarRol(['Productor','Administrador', 'Manager', 'Asesor']) ],checksValidaciones,
  obtenerNotificacionesPorCreador
);


router.get(
  '/por-receptor/:id',
  [ verificarRol(['Productor','Administrador', 'Manager', 'Asesor']) ],checksValidaciones,
  obtenerNotificacionesPorReceptor
);

router.get(
  '/',
  [ verificarRol(['Productor','Administrador', 'Manager', 'Asesor']) ],checksValidaciones,
  obtenerNotificacionesTodas
);

router.put(
  '/:id/leida',
  [ verificarRol(['Productor','Administrador', 'Manager', 'Asesor']) ],
  checksValidaciones,
  marcarNotificacionLeida
);


module.exports = router;