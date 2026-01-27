const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesMultimedia');

/**
 * Crea un registro de multimedia en la base de datos.
 */
const crearMultimedia = async ({ tipo, filename, mimetype, size, url, public_id }) => {
  const result = await pool.query(
    queries.crearMultimedia,
    [tipo, filename, mimetype, size, url, public_id]
  );
  return result.rows[0];
};

/**
 * Obtiene un registro de multimedia por su ID.
 */
const obtenerMultimediaPorId = async (id_multimedia) => {
  const result = await pool.query(
    queries.obtenerMultimediaPorId,
    [id_multimedia]
  );
  return result.rows[0];
};

/**
 * Elimina un registro de multimedia por su ID.
 */
const eliminarMultimediaBD = async (id_multimedia) => {
  await pool.query(queries.eliminarMultimedia, [id_multimedia]);
};

/**
 * Vincula un multimedia a una entidad específica (incidencia, reporte o cultivo).
 */
const vincularMultimedia = async (entidad, idEntidad, id_multimedia) => {
  switch (entidad) {
    case 'incidencia':
      await pool.query(queries.vincularIncidencia, [idEntidad, id_multimedia]);
      break;
    case 'reporte':
      await pool.query(queries.vincularReporte, [idEntidad, id_multimedia]);
      break;
    case 'cultivo':
      await pool.query(queries.vincularCultivo, [idEntidad, id_multimedia]);
      break;
    default:
      throw new Error('Entidad no válida');
  }
};

/**
 * Obtiene todos los multimedia asociados a una entidad.
 */
const obtenerMultimediaPorEntidad = async (entidad, idEntidad) => {
  let query;
  switch (entidad) {
    case 'incidencia':
      query = queries.obtenerPorIncidencia;
      break;
    case 'reporte':
      query = queries.obtenerPorReporte;
      break;
    case 'cultivo':
      query = queries.obtenerPorCultivo;
      break;
    default:
      throw new Error('Entidad no válida');
  }
  const result = await pool.query(query, [idEntidad]);
  return result.rows;
};

/**
 * Elimina todos los vínculos de un multimedia.
 */
const eliminarVinculos = async (id_multimedia) => {
  await Promise.all([
    pool.query(queries.eliminarVinculoIncidencia, [id_multimedia]),
    pool.query(queries.eliminarVinculoReporte, [id_multimedia]),
    pool.query(queries.eliminarVinculoCultivo, [id_multimedia])
  ]);
};

/**
 * Cuenta cuántos vínculos tiene un multimedia.
 */
const contarVinculos = async (id_multimedia) => {
  const result = await pool.query(queries.contarVinculos, [id_multimedia]);
  return Number(result.rows[0].total);
};

module.exports = {
  crearMultimedia,
  obtenerMultimediaPorId,
  eliminarMultimediaBD,
  vincularMultimedia,
  obtenerMultimediaPorEntidad,
  eliminarVinculos,
  contarVinculos
};
