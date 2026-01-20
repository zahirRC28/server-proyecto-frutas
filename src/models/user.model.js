const connect = require('../configs/dbConnect');
const queries = require("./Queries/queriesUser");
//usado
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
//usado
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
//usado
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
//usado
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
//usado
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
//usado
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
//usado
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