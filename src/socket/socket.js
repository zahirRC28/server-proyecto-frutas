const jwt = require('jsonwebtoken');
const {
  insertarMensaje,
  conversacionHabilitada,
  marcarMensajesLeidos,
  rolUsuario
} = require('../models/chat.model');
const puedeEnviarMensaje = require('./rules');

module.exports = (io) => {

  //Middleware de autenticación
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error('No autorizado'));

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      socket.user = decoded; // { uid, rol, ... }
      next();
    } catch (err) {
      return next(new Error('Token inválido'));
    }
  });

  //Conexión
  io.on('connection', (socket) => {
    console.log('🟢 Usuario conectado:', socket.user.uid);

    //Entrar en conversación
    socket.on('join_conversation', async (idConversacion) => {
      try {
        socket.join(`conv_${idConversacion}`);

        // Marcar mensajes como leídos
        await marcarMensajesLeidos(idConversacion, socket.user.uid);

        // Avisar al otro usuario que sus mensajes fueron leídos
        socket.to(`conv_${idConversacion}`).emit('messages_read', {
          idConversacion,
          readerId: socket.user.uid
        });
      } catch (error) {
        console.error('Error join_conversation:', error);
      }
    });

    //Typing
    socket.on('typing', ({ idConversacion }) => {
      socket.to(`conv_${idConversacion}`).emit('typing', {
        userId: socket.user.uid
      });
    });

    socket.on('stop_typing', ({ idConversacion }) => {
      socket.to(`conv_${idConversacion}`).emit('stop_typing', {
        userId: socket.user.uid
      });
    });

    //Enviar mensaje
    socket.on('send_message', async ({ idConversacion, contenido, idReceptor }) => {
      try {
        const idEmisor = socket.user.uid;
        //console.log(idReceptor);
        const rolEmisor = await rolUsuario(idReceptor);
        // Validar permisos
        const permitido = await puedeEnviarMensaje(idEmisor, idReceptor, socket.user.rol, rolEmisor.nombre);
        if (!permitido) return socket.emit('error', { msg: 'No puedes enviar mensaje a este usuario' });

        // Validar si la conversación está habilitada
        const habilitada = await conversacionHabilitada(idConversacion);
        if (!habilitada) return socket.emit('error', { msg: 'Conversación no habilitada' });

        // Insertar mensaje
        const mensaje = await insertarMensaje(idConversacion, idEmisor, contenido);

        // Emitir mensaje
        io.to(`conv_${idConversacion}`).emit('new_message', mensaje);
      } catch (error) {
        console.error('Error send_message:', error);
        socket.emit('error', { msg: 'Error enviando mensaje' });
      }
    });
    // Desconexión
    socket.on('disconnect', () => {
      console.log('🔴 Usuario desconectado:', socket.user.uid);
    });
  });
};




