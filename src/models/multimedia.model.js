const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesMultimedia');

const crearMultimedia = async ({
  tipo,
  filename,
  mimetype,
  size,
  url,
  public_id
}) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(
      queries.crearMultimedia,
      [tipo, filename, mimetype, size, url, public_id]
    );
    return result.rows[0];
  } finally {
    client?.release();
  }
};

const obtenerMultimediaPorId = async (id_multimedia) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(
      queries.obtenerMultimediaPorId,
      [id_multimedia]
    );
    return result.rows[0];
  } finally {
    client?.release();
  }
};

const eliminarMultimediaBD = async (id_multimedia) => {
  let client;
  try {
    client = await connect();
    await client.query(
      queries.eliminarMultimedia,
      [id_multimedia]
    );
  } finally {
    client?.release();
  }
};

const vincularMultimedia = async (entidad, idEntidad, id_multimedia) => {
  let client;
  try {
    client = await connect();

    switch (entidad) {
      case 'incidencia':
        await client.query(
          queries.vincularIncidencia,
          [idEntidad, id_multimedia]
        );
        break;

      case 'reporte':
        await client.query(
          queries.vincularReporte,
          [idEntidad, id_multimedia]
        );
        break;

      case 'cultivo':
        await client.query(
          queries.vincularCultivo,
          [idEntidad, id_multimedia]
        );
        break;

      default:
        throw new Error('Entidad no válida');
    }
  } finally {
    client?.release();
  }
};

const obtenerMultimediaPorEntidad = async (entidad, idEntidad) => {
  let client;
  try {
    client = await connect();

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

    const result = await client.query(query, [idEntidad]);
    return result.rows;
  } finally {
    client?.release();
  }
};

const eliminarVinculos = async (id_multimedia) => {
  let client;
  try {
    client = await connect();
    await Promise.all([
      client.query(queries.eliminarVinculoIncidencia, [id_multimedia]),
      client.query(queries.eliminarVinculoReporte, [id_multimedia]),
      client.query(queries.eliminarVinculoCultivo, [id_multimedia])
    ]);
  } finally {
    client?.release();
  }
};

const contarVinculos = async (id_multimedia) => {
  let client;
  try {
    client = await connect();
    const result = await client.query(
      queries.contarVinculos,
      [id_multimedia]
    );
    return Number(result.rows[0].total);
  } finally {
    client?.release();
  }
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
