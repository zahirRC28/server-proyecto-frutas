const pool = require('../configs/dbConnect');
const queries = require('./Queries/queriesAuth');

/**
 * Busca un usuario por correo electrónico para el proceso de inicio de sesión.
 * @async
 * @param {string} correo - Email del usuario proporcionado en el login.
 * @returns {Promise<Object|undefined>} Retorna el objeto del usuario con su hash de contraseña si existe.
 */
const buscarUserLogin = async (correo) => {
  try {
    const result = await pool.query(
      queries.obetenerUsuario,
      [correo]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Comprueba si un correo ya está registrado en la base de datos.
 * @async
 * @param {string} correo - Correo a verificar.
 * @returns {Promise<Object|undefined>} Retorna una fila si el correo existe.
 */
const comprobarCorreo = async (correo) => {
  try {
    const result = await pool.query(
      queries.correoExiste,
      [correo]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Recupera la información básica de un usuario por su ID para la renovación del token.
 * @async
 * @param {number|string} id_user - ID único del usuario.
 * @returns {Promise<Object>} Datos actualizados del usuario.
 */
const renovarUserID = async (id_user) => {
  try {
    const result = await pool.query(
      queries.renovarToken,
      [id_user]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  buscarUserLogin,
  comprobarCorreo,
  renovarUserID
};
