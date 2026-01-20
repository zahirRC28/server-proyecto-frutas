const connect = require('../configs/dbConnect');
const queries = require("./Queries/queriesAsesor"); 

//Obtener la info completa de un cultivo incluyendo los datos de contacto del productor.
const getCultivoById = async (id_cultivo) => {
    let cliente, result;
    try {
        cliente = await connect();
        // Usar la query getCultivoDetalle
        result = await cliente.query(queries.getCultivoDetalle, [id_cultivo]);
        return result.rows[0]; // Se pone 0 cuando es solo un obj
    } catch (error) {
        console.error("Error en model getCultivoById:", error);
        throw error;
    } finally {
        if (cliente) cliente.release(); // Si abrió la conexión, la cerramos. Si ni siquiera se abrió, no hacer nada.
    }
};

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
    getCultivoById,
    getMedicionesByCultivo
};