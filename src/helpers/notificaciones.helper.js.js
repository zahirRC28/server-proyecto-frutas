const { crearUnaNotificacion } = require('../models/notificacion.model');
const { buscarUserByid, obtenerUsuariosPorRolNombre } = require('../models/user.model');
const { getIO } = require('../socket/io');
const usuariosConectados = require('../socket/usuariosConectados'); 

/**
 * Crea notificaciones para:
 * - Manager del productor
 * - Todos los asesores
 */
const notificarManagerYAsesores = async ({
  tipo,
  titulo,
  mensaje,
  id_creador,
  entidad_tipo,
  entidad_id
}) => {
  const io = getIO();

  const productor = await buscarUserByid(id_creador);

  // 🧑‍💼 MANAGER
  if (productor?.id_manager) {
    const noti = await crearUnaNotificacion({
      tipo,
      titulo,
      mensaje,
      id_creador,
      id_receptor: productor.id_manager,
      entidad_tipo,
      entidad_id
    });

    const socketId = usuariosConectados.get(productor.id_manager);
    if (socketId) {
      io.to(socketId).emit('new_notification', noti);
    }
  }

  // 🧑‍🏫 ASESORES (todos)
  const asesores = await obtenerUsuariosPorRolNombre('Asesor');

  for (const asesor of asesores) {
    const noti = await crearUnaNotificacion({
      tipo,
      titulo,
      mensaje,
      id_creador,
      id_receptor: asesor.id_usuario,
      entidad_tipo,
      entidad_id
    });

    const socketId = usuariosConectados.get(asesor.id_usuario);
    if (socketId) {
      io.to(socketId).emit('new_notification', noti);
    }
  }
};
module.exports = {
  notificarManagerYAsesores
};
