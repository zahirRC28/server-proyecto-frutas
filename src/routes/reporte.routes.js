const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const {crearUnReporte, editarReporte, eliminarUnReporte, enviarReporte, listarReportes,verReporte} = require('../controllers/reporte.controller');
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');


// CRUD REPORTES
router.get('/', verificarRol(['Productor', 'Manager', 'Asesor']), listarReportes);
router.get('/:id', verificarRol(['Productor', 'Manager', 'Asesor']), verReporte);

router.post( '/crear',
  [
    verificarRol(['Productor']),
    check('titulo').notEmpty().withMessage('Se necesita título'),
    checksValidaciones
  ],
  crearUnReporte
);

router.put('/editar/:id', verificarRol(['Productor']), editarReporte);
router.delete('/eliminar/:id', verificarRol(['Productor']), eliminarUnReporte);

// Enviar reporte
router.post('/:id/enviar', verificarRol(['Productor', 'Manager', 'Asesor']), enviarReporte);

module.exports = router;