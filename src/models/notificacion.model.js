const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesNotificacion');


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
  const client = await connect();
  try {
    const res = await client.query(
      queries.crearNotificacion_con_now,
      [tipo, titulo, mensaje, leido, id_creador, id_receptor, entidad_tipo, entidad_id]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
};


const obtenerPorCreador = async (id_creador) => {
  const client = await connect();
  try {
    const res = await client.query(queries.obtenerNotificacionesPorCreador, [id_creador]);
    return res.rows;
  } finally {
    client.release();
  }
};

const obtenerPorReceptor = async (id_receptor) => {
  const client = await connect();
  try {
    const res = await client.query(queries.obtenerNotificacionesPorReceptor, [id_receptor]);
    return res.rows;
  } finally {
    client.release();
  }
};

const obtenerTodas = async () => {
  const client = await connect();
  try {
    const res = await client.query(queries.obtenerTodasNotificaciones);
    return res.rows;
  } finally {
    client.release();
  }
};

const marcarComoLeida = async (id_notificacion, id_receptor) => {
  const client = await connect();
  try {
    const res = await client.query(
      queries.actualizarLeido,
      [true, id_notificacion, id_receptor]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
};

const eliminarNotificacionesPorReceptor = async (idReceptor) => {
  const client = await connect();
  try {
    const res = await client.query(queries.eliminarNotificacionesPorReceptor, [idReceptor]);
    return res.rowCount;
  } catch (error) {
    console.log('Error en eliminarNotificacionesPorReceptor:', error);
  }finally {
    client.release();
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