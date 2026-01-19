const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesAuth');

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