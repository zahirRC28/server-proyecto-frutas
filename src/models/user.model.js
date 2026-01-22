const connect = require('../configs/dbConnect');
const queries = require("./Queries/queriesUser");

/**
 * Registra un nuevo usuario en la base de datos.
 * @async
 * @param {Object} userData - Datos del usuario.
 * @returns {Promise<Object>} Fila del usuario creado.
 */
const crearUser = async({nombre, correo, contrasenia, rol, id_manager}) =>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.crearUsuario,[nombre, correo, contrasenia, id_manager, rol]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
};

/**
 * Actualiza la información de un usuario por su ID.
 * @async
 */
const actualizarUsuarioId = async({nombre, correo, contrasenia, rol}, id_user) =>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.actualizarUsuarioById,[nombre, correo, contrasenia, rol, id_user]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
};

/**
 * Cambia el estado de un usuario a activo para permitirle el acceso al sistema.
 * @async
 * @param {number|string} id_user - ID único del usuario.
 * @returns {Promise<Object>} Registro del usuario actualizado.
 */
const activarUser = async(id_user) =>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.activarUser,[id_user]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
};

/**
 * Desactiva la cuenta de un usuario (bloqueo de acceso) sin eliminar sus datos.
 * @async
 * @param {number|string} id_user - ID único del usuario.
 * @returns {Promise<Object>} Registro del usuario actualizado.
 */
const desactivarUser = async(id_user)=>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.desactivarUser,[id_user]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
};

/**
 * Elimina un usuario y sus registros relacionados mediante una transacción.
 * * @async
 * @function eliminarUserEmail
 * @param {string} correo - Correo electrónico del usuario.
 * @param {number} id_usuario - ID único para limpiar tablas relacionadas.
 * @returns {Promise<Object>} Datos del usuario eliminado.
 */
const eliminarUserEmail = async(correo, id_usuario) =>{
    let cliente, result;
    try {
        cliente = await connect();

        await cliente.query('BEGIN');

        await cliente.query(queries.eliminarUserById_notificaciones, [id_usuario]);
        result = await cliente.query(queries.eliminarUserByEmail,[correo]);
        
        await cliente.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        if (cliente) await cliente.query('ROLLBACK');
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
};

/**
 * Obtiene todos los usuarios del sistema excluyendo al usuario actual.
 * @async
 * @param {number} idUser - ID del usuario que solicita la lista.
 */
const todosUsers = async(idUser) =>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.todoLosUserMenosYo,[idUser]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
};

/**
 * Recupera el catálogo completo de roles disponibles en la plataforma.
 * @async
 * @returns {Promise<Array<Object>>} Lista de roles (ej: [{id_rol: 1, nombre_rol: 'Manager'}, ...]).
 */
const obtenerTodosRoles = async() =>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.obetenerRoles);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

/**
 * Busca un rol específico filtrando por su nombre técnico.
 * @async
 * @param {string} nombreRol - Nombre del rol a buscar.
 */
const obtenerRolByNombre = async(nombreRol)=>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.queRol,[nombreRol]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

/**
 * Busca los detalles de un rol a partir de su ID numérico.
 * @async
 * @param {number} id_rol - ID del rol.
 */
const obtenerRolByid = async(id_rol)=>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.queRolID,[id_rol]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

/**
 * Recupera la información completa de un perfil de usuario por su ID.
 * @async
 * @param {number|string} id_user - ID único del usuario.
 */
const buscarUserByid = async(id_user)=>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.buscarUser,[id_user]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }finally{
        cliente.release();
    }
}

/**
 * Verifica la existencia de un correo en la base de datos.
 * @async
 * @returns {Promise<Object|undefined>}
 */
const existeCorreo = async(correo)=>{
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
 * Obtiene usuarios filtrados por el nombre de su rol (ej: 'Productor').
 * @async
 */
const obtenerUsuariosPorRolNombre = async(nombreRol) =>{
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.usuariosPorRolNombre, [nombreRol]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        cliente.release();
    }
}

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
    obtenerUsuariosPorRolNombre
}