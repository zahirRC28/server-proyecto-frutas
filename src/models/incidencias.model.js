const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesIncidencias');

/**
 * Registra una nueva incidencia.
 */
const crearIncidencia = async ({ titulo, descripcion, tipo, prioridad, id_cultivo, id_productor }) => {
  const result = await pool.query(
    queries.create,
    [titulo, descripcion, tipo, prioridad || 'media', id_cultivo, id_productor]
  );
  return result.rows[0];
};

/**
 * Obtiene el listado completo de todas las incidencias del sistema.
 */
const getTodasIncidencias = async () => {
  const result = await pool.query(queries.getAll, []);
  return result.rows;
};

/**
 * Busca una incidencia específica por su ID.
 */
const getIncidenciaById = async (id) => {
  const result = await pool.query(queries.getPorId, [id]);
  return result.rows[0];
};

/**
 * Recupera todas las incidencias reportadas por un productor específico.
 */
const getIncidenciasProductor = async (id_productor) => {
  const result = await pool.query(queries.getByProductor, [id_productor]);
  return result.rows;
};

/**
 * Actualiza todos los campos de una incidencia.
 */
const editarIncidencia = async ({ titulo, descripcion, tipo, prioridad, estado, id_cultivo, id_productor }, id_incidencia) => {
  const result = await pool.query(
    queries.editar,
    [titulo, descripcion, tipo, prioridad, estado, id_cultivo, id_productor, id_incidencia]
  );
  return result.rows[0];
};

/**
 * Actualiza el estado de flujo de una incidencia.
 */
const cambiarEstadoIncidencia = async (id, estado) => {
  const result = await pool.query(queries.cambiarEstado, [estado, id]);
  return result.rows[0];
};

/**
 * Modifica el nivel de prioridad de una incidencia existente.
 */
const cambiarPrioridadIncidencia = async (id, prioridad) => {
  const result = await pool.query(queries.cambiarPrioridad, [prioridad, id]);
  return result.rows[0];
};

/**
 * Elimina una incidencia del sistema de forma permanente.
 */
const deleteIncidencia = async (id) => {
  const result = await pool.query(queries.delete, [id]);
  return result.rows[0];
};

module.exports = {
  crearIncidencia,
  getTodasIncidencias,
  getIncidenciaById,
  getIncidenciasProductor,
  editarIncidencia,
  cambiarEstadoIncidencia,
  cambiarPrioridadIncidencia,
  deleteIncidencia
};
