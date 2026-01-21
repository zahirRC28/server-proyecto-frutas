const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesCultivos');

function parseGeom(row) {
  if (!row) return row;
  if (row.poligono_geojson) {
    try { row.poligono = JSON.parse(row.poligono_geojson); } catch (e) { row.poligono = null; }
    delete row.poligono_geojson;
  }
  return row;
}

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
  obtenerCultivoPorId,
  actualizarCultivo,
  eliminarCultivo
};