const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesCultivos');

/**
 * Función auxiliar para transformar strings GeoJSON de la BD en objetos JSON nativos.
 * @function parseGeom
 * @param {Object} row - Fila obtenida de la base de datos.
 * @returns {Object} Fila con la propiedad 'poligono' parseada y limpieza de campos temporales.
 */
function parseGeom(row) {
  if (!row) return row;
  if (row.poligono_geojson) {
    try { row.poligono = JSON.parse(row.poligono_geojson); } catch (e) { row.poligono = null; }
    delete row.poligono_geojson;
  }
  return row;
}

/**
 * Registra un nuevo cultivo con su delimitación geográfica.
 * @async
 * @param {Object} datos - Atributos del cultivo e id_productor.
 * @param {Object} datos.poligonoGeoJSON - Objeto GeoJSON que representa el área del cultivo.
 * @returns {Promise<Object>} Registro del cultivo creado y procesado.
 */
const crearCultivo = async ({ nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligonoGeoJSON, id_productor }) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.crearCultivo, [
      nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego,
      JSON.stringify(poligonoGeoJSON), id_productor
    ]);
    return parseGeom(res.rows[0]);
  } finally {
    if (client) client.release();
  }
};

/**
 * Recupera el listado global de cultivos.
 * @async
 * @returns {Promise<Array<Object>>} Lista de cultivos con sus geometrías parseadas.
 */
const obtenerCultivos = async () => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.obtenerCultivos, []);
    return res.rows.map(parseGeom);
  } finally {
    if (client) client.release();
  }
};

/**
 * Recupera todos los cultivos pertenecientes a un productor específico.
 * @async
 * @param {number|string} id_productor - ID del propietario de los cultivos.
 */
const obtenerCultivosProductor = async (id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.obtenerCultivosProductor, [id_productor]);
    return res.rows.map(parseGeom);
  } finally {
    if (client) client.release();
  }
};

/**
 * Obtiene la información detallada de un cultivo por su ID.
 * @async
 * @param {number|string} id_cultivo - ID único del cultivo.
 */
const obtenerCultivoPorId = async (id_cultivo) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.obtenerCultivoPorId, [id_cultivo]);
    return parseGeom(res.rows[0]);
  } finally {
    if (client) client.release();
  }
};

/**
 * Actualiza los datos de un cultivo existente, validando la propiedad del productor.
 * @async
 */
const actualizarCultivo = async ({ nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligonoGeoJSON }, id_cultivo, id_productor) => {
  let client;
  try {
    client = await connect();
    const pol = poligonoGeoJSON ? JSON.stringify(poligonoGeoJSON) : null;
    console.log(pol)
    const res = await client.query(queries.actualizarCultivo, [
      nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego,
      pol, id_cultivo, id_productor
    ]);
    return parseGeom(res.rows[0]);
  } finally {
    if (client) client.release();
  }
};

/**
 * Elimina un cultivo de la base de datos.
 * @async
 * @param {number} id_cultivo - ID del cultivo a borrar.
 * @param {number} id_productor - ID del productor (para asegurar permisos de borrado).
 */
const eliminarCultivo = async (id_cultivo, id_productor) => {
  let client;
  try {
    client = await connect();
    const res = await client.query(queries.eliminarCultivo, [id_cultivo, id_productor]);
    return res.rows[0];
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  crearCultivo,
  obtenerCultivos,
  obtenerCultivosProductor,
  obtenerCultivoPorId,
  actualizarCultivo,
  eliminarCultivo
};