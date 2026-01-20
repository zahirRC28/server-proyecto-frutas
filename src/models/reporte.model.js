const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesReporte');

const crearReporte = async ({ id_incidencia = null, es_incidencia = false, titulo, descripcion, id_productor }) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.crearReporte, [id_incidencia, es_incidencia, titulo, descripcion, id_productor]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

const obtenerReportesPorProductor = async (id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.obtenerReportesPorProductor, [id_productor]);
    return res.rows;
  } finally {
    if (client) client.release();
  }
};

const obtenerReportePorId = async (id_reporte, id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.obtenerReportePorId, [id_reporte, id_productor]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

const actualizarReporte = async ({ titulo, descripcion }, id_reporte, id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.actualizarReporte, [titulo, descripcion, id_reporte, id_productor]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

const eliminarReporte = async (id_reporte, id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.eliminarReporte, [id_reporte, id_productor]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

const insertarMultimedia = async (id_reporte, tipo, filename, mimetype, size, url) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.insertarMultimedia, [id_reporte, tipo, filename, mimetype, size, url]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

const obtenerMultimediaPorReporte = async (id_reporte) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.obtenerMultimediaPorReporte, [id_reporte]);
    return res.rows;
  } finally {
    if (client) client.release();
  }
};

const marcarEnviado = async (id_reporte, id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.marcarEnviado, [id_reporte, id_productor]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  crearReporte,
  obtenerReportesPorProductor,
  obtenerReportePorId,
  actualizarReporte,
  eliminarReporte,
  insertarMultimedia,
  obtenerMultimediaPorReporte,
  marcarEnviado
};