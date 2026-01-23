const express = require('express');
const { check } = require('express-validator')
const router = express.Router();
const { getTemperatura, getHumedadRelativa, getHumedadSuelo, getPrecipitacion, getVientoVelocidad, getVientoDireccion, getEvapotranspiracion, getHistoricoPorFechas, getAlertaPlagas, getAnalisisClimatico, getAlertaMeteorologica } = require('../controllers/api.controller')
const { verificarJWT } = require("../middlewares/validarJWT")
const { checksValidaciones } = require("../middlewares/checkValidations")
const { verificarRol } = require('../middlewares/verificarRol');

router.post('/temperatura', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getTemperatura);
router.post('/humedad-relativa', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getHumedadRelativa);
router.post('/humedad-suelo', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getHumedadSuelo);
router.post('/precipitacion', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getPrecipitacion);
router.post('/viento-velocidad', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getVientoVelocidad);
router.post('/viento-direccion', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getVientoDireccion);
router.post('/evapotranspiracion', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getEvapotranspiracion);
router.post('/historico', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getHistoricoPorFechas);
router.get('/alerta-plagas', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAlertaPlagas);
router.get('/analisis-climatico', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAnalisisClimatico);
router.post('/alerta-meteo', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAlertaMeteorologica);

module.exports = router;

