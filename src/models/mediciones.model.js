const connect = require('../configs/dbConnect');
const queries = require("./Queries/queriesMediciones"); 

//Obtener las mediciones de un cultivo
const getMedicionesByCultivo = async (id_cultivo) => {
    let cliente, result;
    try {
        cliente = await connect();
        result = await cliente.query(queries.getMedicionesPorCultivo, [id_cultivo]);
        return result.rows; // Retornar array de mediciones (No poner 0 porque es una lista de objs)
    } catch (error) {
        console.error("Error en model getMedicionesByCultivo:", error);
        throw error;
    } finally {
        if (cliente) cliente.release();
    }
};

module.exports = {
    getMedicionesByCultivo
};