const express = require('express');
const { check } = require('express-validator')
const router = express.Router();
const { login, renovarToken } = require('../controllers/auth.controller');
const { verificarJWT } = require("../middlewares/validarJWT")
const { checksValidaciones } = require("../middlewares/checkValidations")

router.post('/auth/login',[
    check('correo')
        .notEmpty().withMessage("Tienes que escribir un correo").bail()
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Escriba un correo electrónico válido.").bail()
        .isLength({ min: 5, max: 50 }).withMessage("El correo no tiene logitud suficiente").bail()
    ,check('contrasenia')
        .notEmpty().withMessage("Tienes que escribir una contraseña").bail()
        .isStrongPassword({ minLength: 6 }).withMessage("La contraseña debe tener entre 6 y 10 caracteres, contener por lo menos una minúscula, una mayúscula, un número y un símbolo.").bail()
    ,checksValidaciones
],login);

router.get('/auth/renovar', verificarJWT, renovarToken);
module.exports = router;