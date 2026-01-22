const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesIncidencias'); 

/**
 * Registra una nueva incidencia.
 * @async
 * @param {Object} data - Datos de la incidencia.
 * @param {string} [data.prioridad='media'] - Nivel de urgencia.
 * @returns {Promise<Object>} La fila de la incidencia recién creada.
 */
const crearIncidencia = async ({ titulo, descripcion, tipo, prioridad, id_cultivo, id_productor }) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.create, [
      titulo, 
      descripcion, 
      tipo, 
      prioridad || 'media', 
      id_cultivo, 
      id_productor
    ]);
    return result.rows[0];
  } finally {
    if (client) client.release();
  }
};

/**
 * Obtiene el listado completo de todas las incidencias del sistema.
 * @async
 * @returns {Promise<Array<Object>>}
 */
const getTodasIncidencias = async () => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.getAll, []);
    return result.rows;
  } finally {
    if (client) client.release();
  }
};

/**
 * Busca una incidencia específica por su identificador único.
 * @async
 * @param {number|string} id - ID de la incidencia.
 */
const getIncidenciaById = async (id) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.getPorId, [id]);
    return result.rows[0];
  } finally {
    if (client) client.release();
  }
};

/**
 * Recupera todas las incidencias reportadas por un productor específico.
 * @async
 * @param {number|string} id_productor - ID del autor.
 */
const getIncidenciasProductor = async (id_productor) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.getByProductor, [id_productor]);
    return result.rows;
  } finally {
    if (client) client.release();
  }
};

/**
 * Actualiza todos los campos de una incidencia.
 * @async
 */
const editarIncidencia = async ({ titulo, descripcion, tipo, prioridad, estado, id_cultivo, id_productor }, id_incidencia) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.editar, [
      titulo, 
      descripcion, 
      tipo, 
      prioridad, 
      estado, 
      id_cultivo, 
      id_productor, 
      id_incidencia
    ]);
    return result.rows[0];
  } finally {
    if (client) client.release();
  }
};

/**
 * Actualiza el estado de flujo de una incidencia (ej. 'Pendiente' -> 'Resuelto').
 * @async
 * @param {number} id - ID de la incidencia.
 * @param {string} estado - Nuevo valor de estado.
 */
const cambiarEstadoIncidencia = async (id, estado) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.cambiarEstado, [estado, id]);
    return result.rows[0];
  } finally {
    if (client) client.release();
  }
};

/**
 * Modifica el nivel de prioridad de una incidencia existente.
 * @async
 */
const cambiarPrioridadIncidencia = async (id, prioridad) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.cambiarPrioridad, [prioridad, id]);
    return result.rows[0];
  } finally {
    if (client) client.release();
  }
};

/**
 * Elimina una incidencia del sistema de forma permanente.
 * @async
 */
const deleteIncidencia = async (id) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(queries.delete, [id]);
    return result.rows[0];
  } finally {
    if (client) client.release();
  }
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