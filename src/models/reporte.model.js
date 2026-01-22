const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesReporte');

const crearReporte = async ({ id_incidencia = null, titulo, descripcion, id_productor, id_cultivo }) => {
  const client = await connect();
  const res = await client.query(
    queries.crearReporte,
    [id_incidencia, titulo, descripcion, id_productor, id_cultivo]
  );
  client.release();
  return res.rows[0];
};

const obtenerTodosReportes = async (rol, id_productor) => {
  const client = await connect();
  const res = rol === 'Productor'
    ? await client.query(queries.obtenerReportesPorProductor, [id_productor])
    : await client.query(queries.obtenerTodosLosReportesAdmin);
  client.release();
  return res.rows;
};

const obtenerReportePorId = async (id_reporte) => {
  const client = await connect();
  const res = await client.query(queries.verReportePorId, [id_reporte]);
  client.release();
  return res.rows[0];
};

const actualizarReporte = async ({ titulo, descripcion }, id_reporte, id_productor) => {
  const client = await connect();
  const res = await client.query(queries.actualizarReporte, [titulo, descripcion, id_reporte, id_productor]);
  client.release();
  return res.rows[0];
};

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
