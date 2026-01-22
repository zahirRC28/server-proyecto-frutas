const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const {
    crearNuevaIncidencia,
    obtenerTodasIncidencias,
    verIncidenciaById,
    verIncidenciasPorProductor,
    modificarIncidencia,
    eliminarIncidencia,
    actualizarEstadoIncidencia,
    actualizarPrioridadIncidencia
} = require('../controllers/incidencias.controller');
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');

// Crear incidencia (solo puede el productor)
router.post('/crear', [
    verificarRol(['Productor']),
    check('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres')
        .trim()
        .bail(),
    check('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .trim()
        .bail(),
    check('tipo')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isLength({ max: 50 }).withMessage('El tipo no puede exceder 50 caracteres')
        .trim()
        .bail(),
    check('id_cultivo')
        .notEmpty().withMessage('El id_cultivo es obligatorio')
        .isInt().withMessage('El id_cultivo debe ser un número entero'),
    check('id_productor')
        .notEmpty().withMessage('El id_productor es obligatorio')
        .isInt().withMessage('El id_productor debe ser un número entero'),
    checksValidaciones  //middleware que ejecuta la validación y lanza errores
], crearNuevaIncidencia)

// Ver TODAS las incidencias
router.get('/listado', verificarRol(['Manager', 'Asesor', 'Administrador']), obtenerTodasIncidencias);

// Ver incidencia por id
router.get('/:id', verificarRol(['Productor', 'Manager', 'Asesor', 'Administrador']), verIncidenciaById);

// Ver todas las incidencias de un productor
router.get('/productor/:id', verificarRol(['Productor', 'Manager', 'Asesor', 'Administrador']), verIncidenciasPorProductor);

// Editar una incidencia (por id)
router.put('/editar/:id', [
    verificarRol(['Manager', 'Administrador']),
    check('titulo')
        .optional() // Solo valida si el campo existe en el body
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres')
        .trim()
        .bail(),
    check('descripcion')
        .optional()
        .notEmpty().withMessage('La descripción es obligatoria')
        .trim()
        .bail(),
    check('tipo')
        .optional()
        .notEmpty().withMessage('El tipo es obligatorio')
        .isLength({ max: 50 }).withMessage('El tipo no puede exceder 50 caracteres')
        .trim()
        .bail(),
    check('prioridad')
        .optional()
        .isIn(['baja', 'media', 'alta']).withMessage('La prioridad debe ser baja, media o alta')
        .trim()
        .bail(),
    check('estado')
        .optional()
        .isIn(['abierta', 'en proceso', 'cerrada']).withMessage('El estado debe ser enviada, pendiente, en proceso o cerrada')
        .trim()
        .bail(),
    check('id_cultivo')
        .optional()
        .notEmpty().withMessage('El id_cultivo es obligatorio')
        .isInt().withMessage('El id_cultivo debe ser un número entero'),
    check('id_productor')
        .optional()
        .notEmpty().withMessage('El id_productor es obligatorio')
        .isInt().withMessage('El id_productor debe ser un número entero'),
    checksValidaciones
], modificarIncidencia);

// Eliminar incidencia
router.delete('/eliminar/:id', [
    verificarRol(['Manager', 'Administrador']),
    check('id')
        .notEmpty().withMessage('Se necesita el Id de la incidencia')
        .bail()
        .trim()
        .isInt().withMessage('El id de usuario tiene que ser un numero entero')
        .bail(),
    checksValidaciones
], eliminarIncidencia);

// Cambiar estado de Incidencia
router.patch('/estado/:id', [
    verificarRol(['Manager', 'Asesor', 'Administrador']),
    check('id')
        .isInt().withMessage('El ID de la incidencia debe ser un número entero'),
    check('estado')
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(['abierta', 'en proceso', 'cerrada'])
        .withMessage('Estado no válido. Los valores permitidos son: abierta en proceso o cerrada'),
    checksValidaciones
], actualizarEstadoIncidencia);

// Cambiar la prioridad de la incidencia (solo Manager)
router.patch('/prioridad/:id', [
    verificarRol(['Manager', 'Administrador']),
    check('id')
        .isInt().withMessage('El ID de la incidencia debe ser un número entero'),
    check('prioridad')
        .notEmpty().withMessage('Es obligatorio completar el campo "prioridad"')
        .isIn(['alta', 'media', 'baja'])
        .withMessage('Prioridad no válida. Los valores permitidos son: alta, media o baja'),
    checksValidaciones
], actualizarPrioridadIncidencia);

module.exports = router;