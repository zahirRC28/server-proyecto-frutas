const { getMedicionesByCultivo } = require('../models/mediciones.model');

/**
 * Obtiene el historial de mediciones de un cultivo específico.
 * * @async
 * @function getMediciones
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.query - Parámetros de consulta en la URL (Query Strings).
 * @param {string} req.query.id_cultivo - ID del cultivo del cual se desean obtener métricas.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta JSON con el listado de mediciones (humedad, temperatura, etc.).
 * * @description 
 * Esta función requiere obligatoriamente `id_cultivo` vía query string (ej: /mediciones?id_cultivo=1).
 * Devuelve un array de objetos con los datos históricos procesados por el modelo.
 */
const getMediciones = async (req, res) => {
    try {
        //filtrar por qué cultivo queremos ver datos
        const { id_cultivo } = req.query; 

        if (!id_cultivo) {
            return res.status(400).json({
                ok: false,
                mensaje: "Es necesario el id_cultivo para ver sus mediciones"
            });
        }

        const mediciones = await getMedicionesByCultivo(id_cultivo);

        // Aquí enviamos el array completo (result.rows)
        return res.status(200).json({
            ok: true,
            msg: 'mediciones obtenidas correctamente',
            data: mediciones
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg:  "Error interno del servidor"
        });
    }
};

module.exports = {
    getMediciones
};