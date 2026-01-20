const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const reportesController = require('../controllers/reporte.controller');
const upload = require('../middlewares/uploadVideos'); 
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');

const rolProductor = verificarRol(['Productor']);

// CRUD REPORTES
router.get('/reporte/', rolProductor, reportesController.listarReportes);
router.get('/reporte/:id', rolProductor, reportesController.verReporte);
router.post(
  '/reporte/crear',
  [
    rolProductor,
    check('titulo').notEmpty().withMessage('Se necesita título'),
    checksValidaciones
  ],
  reportesController.crearReporte
);
router.put('/reporte/editar/:id', rolProductor, reportesController.editarReporte);
router.delete('/reporte/eliminar/:id', rolProductor, reportesController.eliminarReporte);

// Adjuntar multimedia (form-data field 'files' o 'multimedia') - acepta multiples
router.post('/reporte/:id/multimedia', rolProductor, upload.array('files', 5), reportesController.uploadMultimedia);

// Enviar reporte
router.post('/reporte/:id/enviar', rolProductor, reportesController.enviarReporte);

module.exports = router;