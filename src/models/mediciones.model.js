const pool = require('../configs/dbConnect');
const queries = require("./Queries/queriesMediciones");

/**
 * Obtiene el historial completo de mediciones asociadas a un cultivo.
 * @async
 * @param {number|string} id_cultivo - Identificador único del cultivo.
 * @returns {Promise<Array<Object>>} Array de objetos con lecturas de sensores.
 */
const getMedicionesByCultivo = async (id_cultivo) => {
  try {
    const result = await pool.query(queries.getMedicionesPorCultivo, [id_cultivo]);
    return result.rows; // Devuelve todas las mediciones
  } catch (error) {
    console.error("Error en model getMedicionesByCultivo:", error);
    throw error;
  }
};

module.exports = {
  getMedicionesByCultivo
};
