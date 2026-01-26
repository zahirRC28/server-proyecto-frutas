const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const { check } = require('express-validator');
const { checksValidaciones } = require('../middlewares/checkValidations');

const {
  crearConversacion,
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje
} = require('../controllers/chat.controller');

// Crear o recuperar conversación
router.post('/conversacion/:idReceptor',
  [
    verificarRol(['Productor', 'Manager', 'Asesor', 'Administrador']),
    check('idReceptor').isInt().withMessage('ID receptor inválido'),
    checksValidaciones
  ],
  crearConversacion
);

// Listar mis conversaciones
router.get('/', verificarRol(['Productor', 'Manager', 'Asesor', 'Administrador']),obtenerConversaciones);

// Obtener mensajes de una conversación
router.get('/:idConversacion', verificarRol(['Productor', 'Manager', 'Asesor', 'Administrador']), obtenerMensajes);

// Enviar mensaje
router.post('/mensaje/:idConversacion',
  [
    verificarRol(['Productor', 'Manager', 'Asesor', 'Administrador']),
    check('contenido').notEmpty().withMessage('Mensaje vacío'),
    checksValidaciones
  ],
  enviarMensaje
);

module.exports = router;
