const {
  crearOObtenerConversacion,
  obtenerConversacionesUsuario,
  obtenerMensajesConversacion,
  insertarMensaje,
  conversacionHabilitada,
  marcarMensajesLeidos,
  posiblesChats
} = require('../models/chat.model');

const crearConversacion = async (req, res) => {
  try {
    const idEmisor = req.userToken.uid;
    const idReceptor = parseInt(req.params.idReceptor);

    // No puedes hablar contigo
    if (idEmisor === idReceptor) {
      return res.status(400).json({ ok: false, msg: 'No puedes crear conversación contigo mismo' });
    }

    const conversacion = await crearOObtenerConversacion(idEmisor, idReceptor);
    res.json({ ok: true, conversacion });
  } catch (error) {
    console.error('Error crearConversacion:', error);
    res.status(500).json({ ok: false, msg: 'Error creando conversación' });
  }
};

const obtenerConversaciones = async (req, res) => {
  try {
    const idUsuario = req.userToken.uid;

    //obetener conversaciones ya existentes
    const conversacionesLlenas = await obtenerConversacionesUsuario(idUsuario);
    //console.log('CONVERSACIONES DB:', conversacionesLlenas);

    //posibles chats
    const conversacionesVacias = await posiblesChats(idUsuario);
    //console.log('POSIBLES CHATS:', conversacionesVacias);

    //primero ponemos las que ya tienen conversacion
    const conversaciones = [...conversacionesLlenas];

    //fucionar todo
    conversacionesVacias.forEach(u => {
      const usuarioMenor = Math.min(idUsuario, u.id_usuario);
      const usuarioMayor = Math.max(idUsuario, u.id_usuario);

      const existe = conversacionesLlenas.find(c =>
        c.usuario_menor === usuarioMenor &&
        c.usuario_mayor === usuarioMayor
      );

      if (!existe) {
        conversaciones.push({
          id_conversacion: null,
          usuario_menor: usuarioMenor,
          usuario_mayor: usuarioMayor,
          nombre_completo: u.nombre_completo,
          rol_otro_usuario: u.rol_otro_usuario,
          creada: null,
          habilitada: true
        });
      }
    });

    //console.log('CONVERSACIONES TOTALES:', conversaciones);

    res.json({ ok: true, conversaciones });

  } catch (error) {
    console.error('Error obtenerConversaciones:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error obteniendo conversaciones'
    });
  }
};

const obtenerMensajes = async (req, res) => {
  try {
    const { idConversacion } = req.params;

    const mensajes = await obtenerMensajesConversacion(idConversacion);
    //console.log('MENSAJES:', mensajes);
    const idUsuario = req.userToken.uid;
    await marcarMensajesLeidos(idConversacion, idUsuario);

    res.json({ ok: true, mensajes });
  } catch (error) {
    console.error('Error obtenerMensajes:', error);
    res.status(500).json({ ok: false, msg: 'Error obteniendo mensajes' });
  }
};

const enviarMensaje = async (req, res) => {
  try {
    const { idConversacion } = req.params;
    const { contenido } = req.body;
    const idEmisor = req.userToken.uid;

    // Validar si la conversación está habilitada
    const habilitada = await conversacionHabilitada(idConversacion);
    if (!habilitada) {
      return res.status(403).json({ ok: false, msg: 'Conversación no habilitada' });
    }

    const mensaje = await insertarMensaje(idConversacion, idEmisor, contenido);

    res.status(201).json({ ok: true, mensaje });
  } catch (error) {
    console.error('Error enviarMensaje:', error);
    res.status(500).json({ ok: false, msg: 'Error enviando mensaje' });
  }
};

module.exports = {
  crearConversacion,
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje
};
