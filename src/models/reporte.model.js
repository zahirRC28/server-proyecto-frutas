const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesReporte');

/**
 * Genera un nuevo reporte, opcionalmente vinculado a una incidencia previa.
 * @async
 * @param {Object} data - Datos del reporte.
 * @param {number|null} [data.id_incidencia=null] - ID de la incidencia relacionada (opcional).
 * @param {string} data.titulo - Título del reporte.
 * @param {string} data.descripcion - Contenido técnico del reporte.
 * @param {number} data.id_productor - Autor del reporte.
 * @param {number} data.id_cultivo - Cultivo al que pertenece el reporte.
 * @returns {Promise<Object>} Registro del reporte creado.
 */
const crearReporte = async ({ id_incidencia = null, titulo, descripcion, id_productor, id_cultivo }) => {
  const client = await connect();
  const res = await client.query(
    queries.crearReporte,
    [id_incidencia, titulo, descripcion, id_productor, id_cultivo]
  );
  client.release();
  return res.rows[0];
};

/**
 * Recupera reportes filtrando por permisos de usuario.
 * @async
 * @param {string} rol - Rol del usuario que realiza la consulta ('Productor' o 'Manager'/'Admin').
 * @param {number} id_productor - ID del usuario para filtrar si es Productor.
 * @returns {Promise<Array<Object>>} Lista de reportes (propios si es Productor, todos si es Admin).
 * @description Aplica una bifurcación de query según el nivel de acceso del usuario.
 */
const obtenerTodosReportes = async (rol, id_productor) => {
  const client = await connect();
  const res = rol === 'Productor'
    ? await client.query(queries.obtenerReportesPorProductor, [id_productor])
    : await client.query(queries.obtenerTodosLosReportesAdmin);
  client.release();
  return res.rows;
};

/**
 * Obtiene el detalle de un reporte específico por su ID.
 * @async
 * @param {number} id_reporte - Identificador único.
 */
const obtenerReportePorId = async (id_reporte) => {
  const client = await connect();
  const res = await client.query(queries.verReportePorId, [id_reporte]);
  client.release();
  return res.rows[0];
};

/**
 * Modifica el contenido de un reporte existente.
 * @async
 * @param {Object} data - Nuevos datos (titulo, descripcion).
 * @param {number} id_reporte - ID del reporte a editar.
 * @param {number} id_productor - ID del autor (para validación de autoría).
 */
const actualizarReporte = async ({ titulo, descripcion }, id_reporte, id_productor) => {
  const client = await connect();
  const res = await client.query(queries.actualizarReporte, [titulo, descripcion, id_reporte, id_productor]);
  client.release();
  return res.rows[0];
};

/**
 * Elimina un reporte del sistema.
 * @async
 * @param {number} id_reporte - ID del reporte.
 * @param {number} id_productor - ID del autor (para validación de permisos).
 */
const eliminarReporte = async (id_reporte, id_productor) => {
  const client = await connect();
  const res = await client.query(queries.eliminarReporte, [id_reporte, id_productor]);
  client.release();
  return res.rows[0];
};

module.exports = {
  crearReporte,
  obtenerTodosReportes,
  obtenerReportePorId,
  actualizarReporte,
  eliminarReporte
};
