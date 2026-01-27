const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesCultivos');

/**
 * Función auxiliar para transformar strings GeoJSON de la BD en objetos JSON nativos.
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
 */
const crearCultivo = async ({ nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligonoGeoJSON, id_productor }) => {
  const res = await pool.query(
    queries.crearCultivo,
    [
      nombre,
      zona_cultivo,
      tipo_cultivo,
      region,
      pais,
      sistema_riego,
      JSON.stringify(poligonoGeoJSON),
      id_productor
    ]
  );
  return parseGeom(res.rows[0]);
};

/**
 * Recupera el listado global de cultivos.
 */
const obtenerCultivos = async () => {
  const res = await pool.query(queries.obtenerCultivos, []);
  return res.rows.map(parseGeom);
};

/**
 * Recupera todos los cultivos de un productor específico.
 */
const obtenerCultivosProductor = async (id_productor) => {
  const res = await pool.query(queries.obtenerCultivosProductor, [id_productor]);
  return res.rows.map(parseGeom);
};

/**
 * Obtiene la información detallada de un cultivo por su ID.
 */
const obtenerCultivoPorId = async (id_cultivo) => {
  const res = await pool.query(queries.obtenerCultivoPorId, [id_cultivo]);
  return parseGeom(res.rows[0]);
};

/**
 * Actualiza los datos de un cultivo existente, validando la propiedad del productor.
 */
const actualizarCultivo = async ({ nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligonoGeoJSON }, id_cultivo, id_productor) => {
  const pol = poligonoGeoJSON ? JSON.stringify(poligonoGeoJSON) : null;
  const res = await pool.query(
    queries.actualizarCultivo,
    [
      nombre,
      zona_cultivo,
      tipo_cultivo,
      region,
      pais,
      sistema_riego,
      pol,
      id_cultivo,
      id_productor
    ]
  );
  return parseGeom(res.rows[0]);
};

/**
 * Elimina un cultivo de la base de datos.
 */
const eliminarCultivo = async (id_cultivo, id_productor) => {
  const res = await pool.query(
    queries.eliminarCultivo,
    [id_cultivo, id_productor]
  );
  return res.rows[0];
};

module.exports = {
  crearCultivo,
  obtenerCultivos,
  obtenerCultivosProductor,
  obtenerCultivoPorId,
  actualizarCultivo,
  eliminarCultivo
};
