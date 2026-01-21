const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const { crearUnCultivo, editarCultivo, eliminarUnCultivo, listarCultivos, verCultivoID } = require('../controllers/cultivos.controller');
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');

//Ver cultivos-funciona
router.get('/', verificarRol(['Administrador', 'Manager', 'Asesor']), listarCultivos);

//ver cultivos-funciona
router.get('/:id', verificarRol(['Productor','Administrador', 'Manager', 'Asesor']), verCultivoID);

//Crear Cultivo -Funciona
router.post(
  '/crear',
  [
    verificarRol(['Productor']),
    check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    check('pais').notEmpty().withMessage('Pais obligatorio (ES)').bail().isLength({ min:2, max:2 }).withMessage('Codigo pais 2 letras'),
    checksValidaciones
  ],
  crearUnCultivo
);

//Actualizar Cultivo
router.put('/editar/:id', verificarRol(['Productor']), editarCultivo);


//EliminarCultivo-fUNCIONA
router.delete('/eliminar/:id', verificarRol(['Productor']), eliminarUnCultivo);

module.exports = router;