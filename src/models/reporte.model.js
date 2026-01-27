const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesReporte');

/**
 * Genera un nuevo reporte.
 */
const crearReporte = async ({ id_incidencia = null, titulo, descripcion, id_productor, id_cultivo }) => {
  const res = await pool.query(
    queries.crearReporte,
    [id_incidencia, titulo, descripcion, id_productor, id_cultivo]
  );
  return res.rows[0];
};

/**
 * Recupera reportes filtrando por permisos de usuario.
 * - Productor: solo sus reportes
 * - Manager: reportes de productores asociados (usuarios.id_manager = uid)
 * - Asesor / Administrador: todos
 */
const obtenerTodosReportes = async (rol, uid) => {
  let res;
  if (rol === 'Productor') {
    res = await pool.query(queries.obtenerReportesPorProductor, [uid]);
  } else if (rol === 'Manager') {
    res = await pool.query(queries.obtenerReportesPorManager, [uid]);
  } else {
    // Asesor o Administrador
    res = await pool.query(queries.obtenerTodosLosReportesAdmin);
  }
  return res.rows;
};

/**
 * Recupera un reporte específico por su ID.
 */
const obtenerReportePorId = async (id_reporte) => {
  const res = await pool.query(queries.verReportePorId, [id_reporte]);
  return res.rows[0];
};

/**
 * Actualiza un reporte validando que el productor sea el autor.
 */
const actualizarReporte = async ({ titulo, descripcion }, id_reporte, id_productor) => {
  const res = await pool.query(queries.actualizarReporte, [titulo, descripcion, id_reporte, id_productor]);
  return res.rows[0];
};

/**
 * Actualiza un reporte como Admin, sin validar autoría.
 */
const actualizarReporteAsAdmin = async ({ titulo, descripcion }, id_reporte) => {
  const res = await pool.query(queries.actualizarReporteAsAdmin, [titulo, descripcion, id_reporte]);
  return res.rows[0];
};

/**
 * Elimina un reporte validando autoría del productor.
 */
const eliminarReporte = async (id_reporte, id_productor) => {
  const res = await pool.query(queries.eliminarReporte, [id_reporte, id_productor]);
  return res.rows[0];
};

/**
 * Elimina un reporte como Admin, sin validar autoría.
 */
const eliminarReporteAsAdmin = async (id_reporte) => {
  const res = await pool.query(queries.eliminarReporteAsAdmin, [id_reporte]);
  return res.rows[0];
};

module.exports = {
  crearReporte,
  obtenerTodosReportes,
  obtenerReportePorId,
  actualizarReporte,
  actualizarReporteAsAdmin,
  eliminarReporte,
  eliminarReporteAsAdmin
};
