const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesPdf');

// 🔹 INCIDENCIA
const obtenerDatosIncidenciaPDF = async (idIncidencia) => {
  const res = await pool.query(
    queries.obtenerIncidenciaCompleta,
    [idIncidencia]
  );
  return res.rows[0];
};

// 🔹 REPORTE
const obtenerDatosReportePDF = async (idReporte) => {
  const res = await pool.query(
    queries.obtenerReporteCompleto,
    [idReporte]
  );
  return res.rows[0];
};

// 🔹 CULTIVO
const obtenerDatosCultivoPDF = async (idCultivo) => {
  const res = await pool.query(
    queries.obtenerCultivoCompleto,
    [idCultivo]
  );
  return res.rows[0];
};

module.exports = {
  obtenerDatosIncidenciaPDF,
  obtenerDatosReportePDF,
  obtenerDatosCultivoPDF
};
