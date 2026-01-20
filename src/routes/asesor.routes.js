const express = require('express');
const router = express.Router();
const { getCultivoDetalles, getMediciones /*, getReporteById, descargarReporte*/} = require('../controllers/asesor.controller');
const { verificarRol } = require("../middlewares/verificarRol");
const { verificarJWT } = require('../middlewares/validarJWT');
const { checksValidaciones } = require('../middlewares/checkValidations');
const { check } = require('express-validator');


//--------FUNCIONALIDADES DEL ASESOR----------------
// Lista notificaciones
// Detalle notificación
// Conversación desde notificación
// Enviar / recibir mensajes
// Vista detalle cultivo/parcela
// Ver y descargar reporte
// Ver y buscar datos: tendencias, histórico…
// Enviar notas a otros asesores
// Cambiar estado incidencia


// Listar todas las notificaciones
//router.get('/notificaciones', [verificarJWT, verificarRol], getNotificaciones);

// Ver detalle de una notificación (incluye el estado de la incidencia)
//router.get('/notificaciones/:id', [verificarJWT, verificarRol], getNotificacionById);

// Ver el detalle de un cultivo-parcela
router.get('/cultivo/:id', [verificarJWT, verificarRol(['Asesor'])],  getCultivoDetalles);

// Ver datos históricos, tendencias...de un cultivo
router.get('/mediciones/:id', [verificarJWT, verificarRol(['Asesor'])], getMediciones);

// Ver y descargar reporte
// router.get('/reporte/:id', [verificarJWT, verificarRol], getReporteById)
// router.get('/reportes/:id/descargar', [verificarJWT, verificarRol], descargarReporte);

module.exports = router;