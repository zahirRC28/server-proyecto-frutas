const express = require('express');
const { check } = require('express-validator')
const router = express.Router();
const { verificarJWT } = require("../middlewares/validarJWT")
const { checksValidaciones } = require("../middlewares/checkValidations")
const { verificarRol } = require('../middlewares/verificarRol');
const upload = require('../middlewares/upload');
const {
    getAllMediciones,
    getHistoricoPorFechas,
    getAlertaPlagas,
    getAnalisisClimatico,
    getAlertaMeteorologica,
    identificarImagenPlaga,
    identificarImagenPlanta,
    getInfoSuelo,
    chatAsistente
} = require('../controllers/api.controller')

router.post('/mediciones/:variable', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAllMediciones);
router.post('/historico', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getHistoricoPorFechas);
router.get('/alerta-plagas', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAlertaPlagas);
router.get('/analisis-climatico', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAnalisisClimatico);
router.post('/alerta-meteo', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getAlertaMeteorologica);
router.post('/identificar-plaga', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], upload.single('file'), identificarImagenPlaga);
router.post('/identificar-planta', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], upload.single('image'), identificarImagenPlanta);
router.post('/info-suelo', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], getInfoSuelo);
router.post('/chatbot', [verificarRol(['Asesor', 'Productor', 'Manager', 'Administrador'])], chatAsistente);

module.exports = router;

