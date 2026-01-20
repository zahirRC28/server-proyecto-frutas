const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const reportesController = require('../controllers/reporte.controller');
const upload = require('../middlewares/uploadVideos');
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');


// CRUD REPORTES
router.get('/reporte/', verificarRol(['Productor', 'Manager', 'Asesor']), reportesController.listarReportes);
router.get('/reporte/:id', verificarRol(['Productor', 'Manager', 'Asesor']), reportesController.verReporte);
router.post(
  '/reporte/crear',
  [
    rolProductor,
    check('titulo').notEmpty().withMessage('Se necesita título'),
    checksValidaciones
  ],
  reportesController.crearReporte
);
router.put('/reporte/editar/:id', verificarRol(['Productor']), reportesController.editarReporte);
router.delete('/reporte/eliminar/:id', verificarRol(['Productor']), reportesController.eliminarReporte);

// Adjuntar multimedia (form-data field 'files' o 'multimedia') - acepta multiples
router.post('/reporte/:id/multimedia', verificarRol(['Productor']), upload.array('files', 5), reportesController.uploadMultimedia);

// Enviar reporte
router.post('/reporte/:id/enviar', verificarRol(['Productor', 'Manager', 'Asesor']), reportesController.enviarReporte);

module.exports = router;