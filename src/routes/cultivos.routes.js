const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const cultivoController = require('../controllers/cultivos.controller');
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');


router.get('/cultivos', verificarRol(['Productor']), cultivoController.listarCultivos);
router.get('/cultivos/:id', verificarRol(['Productor']), cultivoController.verCultivo);

router.post(
  '/cultivos/crear',
  [
    verificarRol(['Productor']),
    check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    check('pais').notEmpty().withMessage('Pais obligatorio (ES)').bail().isLength({ min:2, max:2 }).withMessage('Codigo pais 2 letras'),
    checksValidaciones
  ],
  cultivoController.crearCultivo
);

router.put('/cultivos/editar/:id', verificarRol(['Productor']), cultivoController.editarCultivo);
router.delete('/cultivos/eliminar/:id', verificarRol(['Productor']), cultivoController.eliminarCultivo);

module.exports = router;