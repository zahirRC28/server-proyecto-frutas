const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesIncidencias'); 

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