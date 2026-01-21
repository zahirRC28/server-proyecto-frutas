const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const { crearUnCultivo, editarCultivo, eliminarUnCultivo, listarCultivos, verCultivoID, listarCultivosPorProductor } = require('../controllers/cultivos.controller');
const { check, param } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');

//Ver cultivos-funciona
router.get('/', verificarRol(['Administrador', 'Manager', 'Asesor']),listarCultivos);

//ver cultivos-funciona
router.get('/:id', [
  verificarRol(['Productor','Administrador', 'Manager', 'Asesor']),
  param('id')
    .isInt({ gt: 0 }).withMessage('El id debe ser un número entero válido'),
  checksValidaciones
], verCultivoID);

router.get('/productor/:id',[
  verificarRol(['Administrador', 'Manager', 'Asesor','Productor']),
  param('id')
    .isInt({ gt: 0 }).withMessage('El id debe ser un número entero válido'),
  checksValidaciones
], listarCultivosPorProductor)

//Crear Cultivo -Funciona
router.post('/crear',[
    verificarRol(['Productor']),
    check('nombre')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isString().withMessage('El nombre debe ser texto')
      .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
      .bail(),
    check('zona_cultivo')
      .notEmpty().withMessage('La zona de cultivo es obligatoria')
      .isString().withMessage('La zona de cultivo debe ser texto')
      .isLength({ min: 3, max: 100 }).withMessage('La zona de cultivo debe tener entre 3 y 100 caracteres')
      .bail(),
    check('tipo_cultivo')
      .notEmpty().withMessage('El tipo de cultivo es obligatorio')
      .isString().withMessage('El tipo de cultivo debe ser texto')
      .isLength({ min: 3, max: 50 }).withMessage('El tipo de cultivo debe tener entre 3 y 50 caracteres')
      .bail(),
    check('region')
      .notEmpty().withMessage('La región es obligatoria')
      .isString().withMessage('La región debe ser texto')
      .isLength({ min: 3, max: 50 }).withMessage('La región debe tener entre 3 y 50 caracteres')
      .bail(),
    check('pais')
      .notEmpty().withMessage('El país es obligatorio')
      .isLength({ min: 2, max: 2 }).withMessage('El código de país debe tener 2 letras')
      .isUppercase().withMessage('El código de país debe estar en mayúsculas')
      .isAlpha().withMessage('El código de país solo puede contener letras')
      .bail(),
    check('sistema_riego')
      .notEmpty().withMessage('El sistema de riego es obligatorio')
      .isString().withMessage('El sistema de riego debe ser texto')
      .isIn(['Aspersión', 'Goteo', 'Gravedad', 'Manual'])
      .withMessage('Sistema de riego no válido'),
    checksValidaciones
  ],crearUnCultivo
);

//Actualizar Cultivo
router.put('/editar/:id', [
  verificarRol(['Productor']),
  param('id')
    .isInt({ gt: 0 }).withMessage('El id debe ser un número entero válido')
    .bail(),
  check('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .bail(),
  check('pais')
    .optional()
    .isLength({ min: 2, max: 2 }).withMessage('El código de país debe tener 2 letras')
    .isUppercase().withMessage('El código de país debe estar en mayúsculas')
    .isAlpha().withMessage('El código de país solo puede contener letras')
    .bail(),
  check('zona_cultivo')
    .optional()
    .isString().withMessage('La zona de cultivo debe ser texto')
    .isLength({ min: 3, max: 100 })
    .bail(),
  check('tipo_cultivo')
    .optional()
    .isString()
    .isLength({ min: 3, max: 50 })
    .bail(),
  check('region')
    .optional()
    .isString()
    .isLength({ min: 3, max: 50 })
    .bail(),
  check('sistema_riego')
    .optional()
    .isIn(['Aspersión', 'Goteo', 'Gravedad', 'Manual'])
    .withMessage('Sistema de riego no válido'),
  checksValidaciones
], editarCultivo);


//EliminarCultivo-fUNCIONA
router.delete('/eliminar/:id', [
  verificarRol(['Productor']),
    param('id')
    .isInt({ gt: 0 }).withMessage('El id debe ser un número entero válido'),
  checksValidaciones
], eliminarUnCultivo);

module.exports = router;