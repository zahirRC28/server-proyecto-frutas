const { getCultivoById, getMedicionesByCultivo } = require('../models/asesor.model');

//Muestra toda la info de una parcela y quién es su dueño
const getCultivoDetalles= async (req, res) => {
    try {
        const { id } = req.params; // Saca ID de la URL
        console.log(id)
        const cultivo = await getCultivoById(id);
        console.log(cultivo)

        if (!cultivo) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el cultivo'
            });
        }

        // Si existe, respuesta exitosa y enviamos el objeto
        return res.status(200).json({
            ok: true,
            data: cultivo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};


//Obtener las mediciones de un cultivo
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
     getCultivoDetalles,
    getMediciones
};