const express = require('express');
const { check } = require('express-validator')
const router = express.Router();
const { getTemperatura } = require('../controllers/api.controller')
const { verificarJWT } = require("../middlewares/validarJWT")
const { checksValidaciones } = require("../middlewares/checkValidations")
const { verificarRol } = require('../middlewares/verificarRol');

router.post('/temperatura', [verificarRol(['Asesor','Productor','Manager','Administrador'])], getTemperatura);


module.exports = router;