const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesReporte');

/**
 * Genera un nuevo reporte.
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
 * - Productor: solo sus reportes
 * - Manager: reportes de productores asociados (usuarios.id_manager = uid)
 * - Asesor / Administrador: todos
 */
const obtenerTodosReportes = async (rol, uid) => {
  const client = await connect();
  let res;
  if (rol === 'Productor') {
    res = await client.query(queries.obtenerReportesPorProductor, [uid]);
  } else if (rol === 'Manager') {
    res = await client.query(queries.obtenerReportesPorManager, [uid]);
  } else {
    // Asesor o Administrador
    res = await client.query(queries.obtenerTodosLosReportesAdmin);
  }
  client.release();
  return res.rows;
};

const obtenerReportePorId = async (id_reporte) => {
  const client = await connect();
  const res = await client.query(queries.verReportePorId, [id_reporte]);
  client.release();
  return res.rows[0];
};

/**
 * Actualiza reporte: si es Productor (o llamada desde controller para Productor) 
 * se usa la query que valida authoría; para Admin usaremos la versión AsAdmin.
 */
const actualizarReporte = async ({ titulo, descripcion }, id_reporte, id_productor) => {
  const client = await connect();
  const res = await client.query(queries.actualizarReporte, [titulo, descripcion, id_reporte, id_productor]);
  client.release();
  return res.rows[0];
};

const actualizarReporteAsAdmin = async ({ titulo, descripcion }, id_reporte) => {
  const client = await connect();
  const res = await client.query(queries.actualizarReporteAsAdmin, [titulo, descripcion, id_reporte]);
  client.release();
  return res.rows[0];
};

const eliminarReporte = async (id_reporte, id_productor) => {
  const client = await connect();
  const res = await client.query(queries.eliminarReporte, [id_reporte, id_productor]);
  client.release();
  return res.rows[0];
};

const eliminarReporteAsAdmin = async (id_reporte) => {
  const client = await connect();
  const res = await client.query(queries.eliminarReporteAsAdmin, [id_reporte]);
  client.release();
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