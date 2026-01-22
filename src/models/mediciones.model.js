const connect = require('../configs/dbConnect');
const queries = require("./Queries/queriesMediciones"); 

/**
 * Obtiene el historial completo de mediciones asociadas a un cultivo.
 * * @async
 * @function getMedicionesByCultivo
 * @param {number|string} id_cultivo - Identificador único del cultivo.
 * @returns {Promise<Array<Object>>} Un array de objetos, donde cada objeto representa una lectura 
 * de sensores (temperatura, humedad, etc.) en un momento específico.
 * * @throws {Error} Si existe un problema en la conexión con la base de datos o en la consulta.
 */
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