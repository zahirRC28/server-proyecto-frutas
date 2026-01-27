const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesChat');

/**
 * Crea una conversación entre dos usuarios o devuelve la existente.
 *
 * @param {number} idEmisor - ID del usuario emisor.
 * @param {number} idReceptor - ID del usuario receptor.
 * @returns {Promise<Object>} Conversación creada u obtenida.
 */
const crearOObtenerConversacion = async (idEmisor, idReceptor) => {
  const res = await pool.query(
    queries.crearConversacion,
    [idEmisor, idReceptor]
  );
  return res.rows[0];
};

/**
 * Obtiene todas las conversaciones de un usuario.
 *
 * @param {number} idUsuario - ID del usuario.
 * @returns {Promise<Array<Object>>} Lista de conversaciones.
 */
const obtenerConversacionesUsuario = async (idUsuario) => {
  const res = await pool.query(
    queries.obtenerConversacionesUsuario,
    [idUsuario]
  );
  return res.rows;
};

/**
 * Obtiene los mensajes de una conversación.
 *
 * @param {number} idConversacion - ID de la conversación.
 * @returns {Promise<Array<Object>>} Mensajes de la conversación.
 */
const obtenerMensajesConversacion = async (idConversacion) => {
  const res = await pool.query(
    queries.obtenerMensajesConversacion,
    [idConversacion]
  );
  return res.rows;
};

/**
 * Inserta un nuevo mensaje en una conversación.
 *
 * @param {number} idConversacion - ID de la conversación.
 * @param {number} idEmisor - ID del usuario emisor.
 * @param {string} contenido - Contenido del mensaje.
 * @returns {Promise<Object>} Mensaje insertado.
 */
const insertarMensaje = async (idConversacion, idEmisor, contenido) => {
  const res = await pool.query(
    queries.insertarMensaje,
    [idConversacion, idEmisor, contenido]
  );
  return res.rows[0];
};

/**
 * Verifica si una conversación está habilitada.
 *
 * @param {number} idConversacion - ID de la conversación.
 * @returns {Promise<boolean>} `true` si está habilitada, `false` en caso contrario.
 */
const conversacionHabilitada = async (idConversacion) => {
  const res = await pool.query(
    queries.conversacionHabilitada,
    [idConversacion]
  );
  return res.rows[0]?.habilitada;
};

/**
 * Marca como leídos los mensajes de una conversación para un usuario.
 *
 * @param {number} idConversacion - ID de la conversación.
 * @param {number} idUsuario - ID del usuario.
 * @returns {Promise<void>}
 */
const marcarMensajesLeidos = async (idConversacion, idUsuario) => {
  await pool.query(
    queries.marcarMensajesLeidos,
    [idConversacion, idUsuario]
  );
};

/**
 * Obtiene el rol de un usuario.
 *
 * @param {number} id_user - ID del usuario.
 * @returns {Promise<Object>} Información del rol del usuario.
 */
const rolUsuario = async (id_user) => {
  const res = await pool.query(
    queries.rolUsuario,
    [id_user]
  );
  return res.rows[0];
};

/**
 * Obtiene la conversación entre dos usuarios si existe.
 *
 * @param {number} idUser1 - ID del primer usuario.
 * @param {number} idUser2 - ID del segundo usuario.
 * @returns {Promise<Object|undefined>} Conversación encontrada o `undefined`.
 */
const obtenerConversacionEntreUsuarios = async (idUser1, idUser2) => {
  const res = await pool.query(
    queries.obstenerUnaConversacion,
    [idUser1, idUser2]
  );
  return res.rows[0];
};

/**
 * Obtiene el primer emisor de una conversación.
 *
 * @param {number} idConversacion - ID de la conversación.
 * @returns {Promise<Object|undefined>} Usuario que inició la conversación.
 */
const obtenerPrimerEmisorDeConversacion = async (idConversacion) => {
  const res = await pool.query(
    queries.obetenerFirstEmisor,
    [idConversacion]
  );
  return res.rows[0];
};

/**
 * Obtiene la lista de posibles chats para un usuario según su rol.
 *
 * - Administrador: todos los usuarios disponibles.
 * - Manager: asesores, managers y productores a su cargo.
 * - Asesor: asesores y managers.
 * - Productor: solo su manager.
 *
 * @param {number} idUsuario - ID del usuario.
 * @returns {Promise<Array<Object>>} Lista de usuarios con los que puede chatear.
 */
const posiblesChats = async (idUsuario) => {
  const { rows: usuario } = await pool.query(`
    SELECT u.id_usuario, u.id_rol, r.nombre AS nombre_rol, u.id_manager
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = $1
  `, [idUsuario]);

  if (!usuario.length) return [];

  const rol = usuario[0].nombre_rol;
  const idManager = usuario[0].id_manager;

  let todos;

  if (rol === 'Administrador') {
    todos = await pool.query(queries.TodosposiblesChats, [idUsuario]);
  } else if (rol === 'Manager') {
    todos = await pool.query(
      queries.TodosAsesoresManagersYProductoresDelManager,
      [idUsuario]
    );
  } else if (rol === 'Asesor') {
    todos = await pool.query(
      queries.TodosAsesoresManagersYAsesores,
      [idUsuario]
    );
  } else if (rol === 'Productor') {
    todos = await pool.query(
      queries.SoloMiManager,
      [idManager]
    );
  } else {
    return [];
  }

  return todos.rows;
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
