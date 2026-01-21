const express = require('express');
const router = express.Router();
const {  getMediciones } = require('../controllers/asesor.controller');
const { verificarRol } = require("../middlewares/verificarRol");
const { verificarJWT } = require('../middlewares/validarJWT');
const { checksValidaciones } = require('../middlewares/checkValidations');
const { check } = require('express-validator');


// Ver datos históricos, tendencias...de un cultivo
router.get('/mediciones/:id', [verificarRol(['Asesor','Productor','Manager','Administrador'])], getMediciones);


module.exports = router;