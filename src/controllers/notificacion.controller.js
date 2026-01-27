const {
  crearUnaNotificacion, 
  obtenerPorCreador, 
  obtenerPorReceptor, 
  obtenerTodas, 
  marcarComoLeida,
  eliminarNotificacionesPorReceptor} = require('../models/notificacion.model');

const crearNotificacion = async (req, res) => {
  try {
    const { tipo, titulo, mensaje, leido = false, id_receptor } = req.body;
    const id_creador = req.userToken && req.userToken.uid;

    if (!id_creador) {
      return res.status(401).json({ 
        ok: false, 
        msg: 'Usuario no autenticado' 
    });
    }

    if (!tipo || !titulo || !mensaje || !id_receptor) {
      return res.status(400).json({
        ok: false,
        msg: 'Campos requeridos: tipo, titulo, mensaje, id_receptor'
      });
    }

    const nuevaNotificacion = await crearUnaNotificacion({
      tipo,
      titulo,
      mensaje,
      leido,
      id_creador,
      id_receptor
    });

    return res.status(201).json({ 
        ok: true, 
        notification: nuevaNotificacion 
    });

  } catch (error) {
    console.error('Error en crearNotificacion:', error);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

const obtenerNotificacionesPorCreador = async (req, res) => {
  try {
    // Si se pasa :id en la ruta, se usa; si no, se usa el id del usuario autenticado
    const idParam = req.params.id;
    console.log(idParam, "a ui")
    const id_creador = idParam || (req.userToken && req.userToken.uid);

    if (!id_creador) {
      return res.status(400).json({
        ok: false,
        msg: 'Falta id del creador (ruta o usuario autenticado)'
      });
    }

    const notifications = await obtenerPorCreador(id_creador);

    return res.status(200).json({
      ok: true,
      notifications
    });
  } catch (error) {
    console.error('Error en obtenerNotificacionesPorCreador:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor'
    });
  }
};

const obtenerNotificacionesPorReceptor = async (req, res) => {
  try {
    const idParam = req.params.id;
    const id_receptor = idParam || (req.userToken && req.userToken.uid);

    if (!id_receptor) {
      return res.status(400).json({
        ok: false,
        msg: 'Falta id del receptor (ruta o usuario autenticado)'
      });
    }

    const notifications = await obtenerPorReceptor(id_receptor);

    return res.status(200).json({
      ok: true,
      notifications
    });
  } catch (error) {
    console.error('Error en obtenerNotificacionesPorReceptor:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor'
    });
  }
};

const obtenerNotificacionesTodas = async (req, res) => {
  try {
    const notifications = await obtenerTodas();
    return res.status(200).json({
      ok: true,
      notifications
    });
  } catch (error) {
    console.error('Error en obtenerNotificacionesTodas:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor'
    });
  }
};

const marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const id_receptor = req.userToken && req.userToken.uid;

    if (!id_receptor) {
      return res.status(401).json({
        ok: false,
        msg: 'Usuario no autenticado'
      });
    }

    const notificacion = await marcarComoLeida(id, id_receptor);

    if (!notificacion) {
      return res.status(404).json({
        ok: false,
        msg: 'Notificación no encontrada o no autorizada'
      });
    }

    return res.status(200).json({
      ok: true,
      notification: notificacion
    });

  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor'
    });
  }
};
const eliminarTodasPorReceptor = async (req, res) => {
    const idReceptor = req.params.id;

    try {
        await eliminarNotificacionesPorReceptor(idReceptor);
        return res.status(200).json({ msg: "Todas las notificaciones eliminadas" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error eliminando notificaciones" });
    }
};

module.exports = { 
  crearNotificacion, 
  obtenerNotificacionesPorCreador,
  obtenerNotificacionesPorReceptor, 
  obtenerNotificacionesTodas, 
  marcarNotificacionLeida,
  eliminarTodasPorReceptor
};