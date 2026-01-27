const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesNotificacion');

/**
 * Crea una nueva notificación.
 */
const crearUnaNotificacion = async ({
  tipo,
  titulo,
  mensaje,
  leido = false,
  id_creador,
  id_receptor,
  entidad_tipo = null,
  entidad_id = null
}) => {
  const res = await pool.query(
    queries.crearNotificacion_con_now,
    [tipo, titulo, mensaje, leido, id_creador, id_receptor, entidad_tipo, entidad_id]
  );
  return res.rows[0];
};

/**
 * Obtiene todas las notificaciones creadas por un usuario.
 */
const obtenerPorCreador = async (id_creador) => {
  const res = await pool.query(
    queries.obtenerNotificacionesPorCreador,
    [id_creador]
  );
  return res.rows;
};

/**
 * Obtiene todas las notificaciones recibidas por un usuario.
 */
const obtenerPorReceptor = async (id_receptor) => {
  const res = await pool.query(
    queries.obtenerNotificacionesPorReceptor,
    [id_receptor]
  );
  return res.rows;
};

/**
 * Obtiene todas las notificaciones de todos los usuarios.
 */
const obtenerTodas = async () => {
  const res = await pool.query(queries.obtenerTodasNotificaciones);
  return res.rows;
};

/**
 * Marca una notificación como leída para un receptor específico.
 */
const marcarComoLeida = async (id_notificacion, id_receptor) => {
  const res = await pool.query(
    queries.actualizarLeido,
    [true, id_notificacion, id_receptor]
  );
  return res.rows[0];
};

/**
 * Elimina todas las notificaciones de un receptor.
 */
const eliminarNotificacionesPorReceptor = async (idReceptor) => {
  try {
    const res = await pool.query(
      queries.eliminarNotificacionesPorReceptor,
      [idReceptor]
    );
    return res.rowCount;
  } catch (error) {
    console.error('Error en eliminarNotificacionesPorReceptor:', error);
    throw error;
  }
};

module.exports = {
  crearUnaNotificacion, 
  obtenerPorCreador, 
  obtenerPorReceptor, 
  obtenerTodas, 
  marcarComoLeida,
  eliminarNotificacionesPorReceptor
};
