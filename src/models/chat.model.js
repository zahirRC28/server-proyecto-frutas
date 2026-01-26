const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesChat');

const crearOObtenerConversacion = async (idEmisor, idReceptor) => {
  const client = await connect();
  try {
    const res = await client.query(queries.crearConversacion, [idEmisor, idReceptor]);
    return res.rows[0];
  }finally {
    client.release();
  }
};

const obtenerConversacionesUsuario = async (idUsuario) => {
  const client = await connect();
  try {
    const res = await client.query(queries.obtenerConversacionesUsuario, [idUsuario]);
    return res.rows;
  } finally {
    client.release();
  }
};

const obtenerMensajesConversacion = async (idConversacion) => {
  const client = await connect();
  try {
    const res = await client.query(queries.obtenerMensajesConversacion, [idConversacion]);
    return res.rows;
  } finally {
    client.release();
  }
};

const insertarMensaje = async (idConversacion, idEmisor, contenido) => {
  const client = await connect();
  try {
    const res = await client.query(queries.insertarMensaje, [idConversacion, idEmisor, contenido]);
    return res.rows[0];
  } finally {
    client.release();
  }
};

const conversacionHabilitada = async (idConversacion) => {
  const client = await connect();
  const res = await client.query(queries.conversacionHabilitada, [idConversacion]);
  client.release();
  return res.rows[0]?.habilitada;
};

const marcarMensajesLeidos = async (idConversacion, idUsuario) => {
  const client = await connect();
  try {
    await client.query(queries.marcarMensajesLeidos, [idConversacion, idUsuario]);
  } finally {
    client.release();
  }
};
const rolUsuario = async(id_user)=>{
  let cliente, result;
  try {
    cliente = await connect();
    result = await cliente.query(queries.rolUsuario,[id_user]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }finally{
    cliente.release();
  }
};
const obtenerConversacionEntreUsuarios = async(idUser1, idUser2)=>{
  let cliente, result;
  //console.log(idUser1, idUser2);
  try {
    cliente =  await connect();
    result = await cliente.query(queries.obstenerUnaConversacion,[idUser1, idUser2]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }finally{
    cliente.release();
  }
};
const obtenerPrimerEmisorDeConversacion = async(idConversacion)=>{
  let cliente, result;
  try {
    cliente =  await connect();
    result = await cliente.query(queries.obetenerFirstEmisor,[idConversacion]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }finally{
    cliente.release();
  }
};

const posiblesChats = async (idUsuario) => {
  const client = await connect();
  try {
    // Datos del usuario actual
    const { rows: usuario } = await client.query(`
      SELECT u.id_usuario, u.id_rol, r.nombre AS nombre_rol, u.id_manager
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = $1
    `, [idUsuario]);

    if (!usuario.length) return [];

    const rolUsuario = usuario[0].nombre_rol;
    const idManager = usuario[0].id_manager;

    let todos;

    if (rolUsuario === 'Administrador') {
      // ADMIN ve a todos
      todos = await client.query(queries.TodosposiblesChats, [idUsuario]);
    } else if (rolUsuario === 'Manager') {
      // MANAGER ve todos los asesores, managers y sus productores
      todos = await client.query(queries.TodosAsesoresManagersYProductoresDelManager, [idUsuario]);
    } else if (rolUsuario === 'Asesor') {
      // ASESOR ve todos los productores, managers y asesores
      todos = await client.query(queries.TodosAsesoresManagersYAsesores, [idUsuario]);
    } else if (rolUsuario === 'Productor') {
      // PRODUCTOR ve solo su manager
      todos = await client.query(queries.SoloMiManager, [idManager]);
    } else {
      return [];
    }

    return todos.rows;

  } finally {
    client.release();
  }
};



module.exports = {
  crearOObtenerConversacion,
  obtenerConversacionesUsuario,
  obtenerMensajesConversacion,
  insertarMensaje,
  conversacionHabilitada,
  marcarMensajesLeidos,
  rolUsuario,
  obtenerConversacionEntreUsuarios,
  obtenerPrimerEmisorDeConversacion,
  posiblesChats
};
