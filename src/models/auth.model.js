const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesAuth');

/**
 * Busca un usuario por correo electrónico para el proceso de inicio de sesión.
 * @async
 * @param {string} correo - Email del usuario proporcionado en el login.
 * @returns {Promise<Object|undefined>} Retorna el objeto del usuario con su hash de contraseña si existe, de lo contrario undefined.
 * @throws {Error} Si ocurre un error en la conexión o en la consulta SQL.
 */
const buscarUserLogin = async(correo)=>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.obetenerUsuario,[correo]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

/**
 * Comprueba si un correo ya está registrado en la base de datos.
 * @async
 * @param {string} correo - Correo a verificar.
 * @returns {Promise<Object|undefined>} Retorna una fila si el correo existe, permitiendo validar duplicados.
 */
const comprobarCorreo = async(correo)=>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.correoExiste,[correo]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

/**
 * Recupera la información básica de un usuario por su ID para la renovación del token.
 * @async
 * @param {number|string} id_user - ID único del usuario extraído del token anterior.
 * @returns {Promise<Object>} Datos actualizados del usuario (uid, nombre, rol).
 */
const renovarUserID = async(id_user)=>{
    let cliente, result;
    try {
        cliente = await connect();
        //console.log(id_user);
        result = await cliente.query(queries.renovarToken, [id_user]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

module.exports = {
    buscarUserLogin,
    comprobarCorreo,
    renovarUserID
}