const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesUser');

/**
 * Registra un nuevo usuario en la base de datos.
 */
const crearUser = async ({ nombre, correo, contrasenia, rol, id_manager }) => {
  const res = await pool.query(queries.crearUsuario, [nombre, correo, contrasenia, id_manager, rol]);
  return res.rows[0];
};

/**
 * Actualiza la información de un usuario por su ID.
 */
const actualizarUsuarioId = async ({ nombre, correo, contrasenia, rol }, id_user) => {
  const res = await pool.query(queries.actualizarUsuarioById, [nombre, correo, contrasenia, rol, id_user]);
  return res.rows[0];
};

/**
 * Activa un usuario.
 */
const activarUser = async (id_user) => {
  const res = await pool.query(queries.activarUser, [id_user]);
  return res.rows[0];
};

/**
 * Desactiva un usuario.
 */
const desactivarUser = async (id_user) => {
  const res = await pool.query(queries.desactivarUser, [id_user]);
  return res.rows[0];
};

/**
 * Elimina un usuario y sus registros relacionados mediante transacción.
 */
const eliminarUserEmail = async (correo, id_usuario) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(queries.eliminarUserById_notificaciones, [id_usuario]);
    const res = await client.query(queries.eliminarUserByEmail, [correo]);

    await client.query('COMMIT');

    return res.rows[0] || null;
  } catch (error) {
    await client.query('ROLLBACK').catch((er) => console.error('Rollback fallido', er));
    console.error('Error en eliminarUserEmail:', error.stack || error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Obtiene todos los usuarios del sistema excluyendo al usuario actual.
 */
const todosUsers = async (idUser) => {
  const res = await pool.query(queries.todoLosUserMenosYo, [idUser]);
  return res.rows;
};

/**
 * Recupera todos los roles disponibles.
 */
const obtenerTodosRoles = async () => {
  const res = await pool.query(queries.obetenerRoles);
  return res.rows;
};

/**
 * Busca un rol específico por nombre.
 */
const obtenerRolByNombre = async (nombreRol) => {
  const res = await pool.query(queries.queRol, [nombreRol]);
  return res.rows[0];
};

/**
 * Busca un rol por ID.
 */
const obtenerRolByid = async (id_rol) => {
  const res = await pool.query(queries.queRolID, [id_rol]);
  return res.rows[0];
};

/**
 * Busca un usuario por ID.
 */
const buscarUserByid = async (id_user) => {
  const res = await pool.query(queries.buscarUser, [id_user]);
  return res.rows[0];
};

/**
 * Verifica si un correo existe en la BD.
 */
const existeCorreo = async (correo) => {
  const res = await pool.query(queries.correoExiste, [correo]);
  return res.rows[0];
};

/**
 * Obtiene usuarios filtrados por nombre de rol.
 */
const obtenerUsuariosPorRolNombre = async (nombreRol) => {
  const res = await pool.query(queries.usuariosPorRolNombre, [nombreRol]);
  return res.rows;
};

/**
 * Obtiene productores según el rol del solicitante.
 */
const obtenerProductoresSegunRol = async (nombreRol, rolSolicitante, uidSolicitante) => {
  if (rolSolicitante === 'Manager') {
    const res = await pool.query(queries.obtenerProductoresPorManager, [nombreRol, uidSolicitante]);
    return res.rows;
  } else {
    const res = await pool.query(queries.usuariosPorRolNombre, [nombreRol]);
    return res.rows;
  }
};

module.exports = {
  crearUser,
  actualizarUsuarioId,
  eliminarUserEmail,
  todosUsers,
  obtenerTodosRoles,
  obtenerRolByNombre,
  obtenerRolByid,
  buscarUserByid,
  existeCorreo,
  activarUser,
  desactivarUser,
  obtenerUsuariosPorRolNombre,
  obtenerProductoresSegunRol
};
