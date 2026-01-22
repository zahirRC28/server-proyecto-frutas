const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesNotificacion');


const crearUnaNotificacion = async ({ 
  tipo, 
  titulo, 
  mensaje, 
  leido = false, 
  id_creador, 
  id_receptor 
}) => {
  const client = await connect();
  try {
    const params = [tipo, titulo, mensaje, leido, id_creador, id_receptor];
    const res = await client.query(queries.crearNotificacion_con_now, params);
    return res.rows[0];

  } finally {
    
    client.release();
  }
};

module.exports = crearUnaNotificacion;