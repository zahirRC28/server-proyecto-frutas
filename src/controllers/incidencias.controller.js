const {
    crearIncidencia,
    getTodasIncidencias,
    getIncidenciaById,
    getIncidenciasProductor,
    editarIncidencia,
    cambiarEstadoIncidencia,
    cambiarPrioridadIncidencia,
    deleteIncidencia } = require('../models/incidencias.model');

/**
 * Registra una nueva incidencia en el sistema.(Prodcutor)
 * @async
 * @param {Object} req.body - Datos de la incidencia: titulo, descripcion, tipo, id_cultivo, id_productor.
 * @note La prioridad se establece como 'media' por defecto en el modelo.
 */
const crearNuevaIncidencia = async (req, res) => {
    try {
        // No incluimos prioridad, el modelo pondrá 'media' por defecto y luego lo puede cambiar el MANAGER
        const { titulo, descripcion, tipo, id_cultivo, id_productor } = req.body;

        const nuevaIncidencia = await crearIncidencia({
            titulo,
            descripcion,
            tipo,
            id_cultivo,
            id_productor
        });

        res.status(201).json({ // estado created
            ok: true,
            msg: "Incidencia creada correctamente",
            data: nuevaIncidencia
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

/**
 * Recupera todas las incidencias registradas.
 * @async
 * @description Usualmente reservado para perfiles administrativos (Manager).
 */
const obtenerTodasIncidencias = async (req, res) => {
    try {
        const incidencias = await getTodasIncidencias();
        res.status(200).json({
            ok: true,
            msg: 'Lista de incidencias obtenida correctamente',
            data: incidencias
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

/**
 * Obtiene el detalle de una incidencia por su ID.
 * @async
 * @description Aplica validación: Los productores solo pueden ver sus propias incidencias.
 * @param {string} req.params.id - ID único de la incidencia.
 */
const verIncidenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        // Extraemos los datos que 'verificarRol' puso en la request
        const { rol, uid } = req.userToken;
        const incidencia = await getIncidenciaById(id);

        if (!incidencia) {
            return res.status(404).json({
                ok: false,
                msg: "Incidencia no encontrada"
            });
        }

        // Si es Productor, solo puede ver sus incidencias por ID, NO las de otros !!
        if (rol === 'Productor' && incidencia.id_productor !== uid) {
            return res.status(403).json({
                ok: false,
                msg: "No tienes permisos para ver incidencias de otros productores."
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Incidencia obtenida correctamente',
            data: incidencia
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

/**
 * Lista todas las incidencias asociadas a un productor específico.
 * @async
 * @param {string} req.params.id - ID del productor a consultar.
 */
const verIncidenciasPorProductor = async (req, res) => {
    try {
        // id del productor desde la url
        const { id } = req.params;
        const { rol, uid } = req.userToken;

        //Si es Productor, solo puede ver sus propias incidencias
        if (rol === 'Productor' && parseInt(id) !== uid) {
            return res.status(403).json({
                ok: false,
                msg: "No tienes permiso para ver las incidencias de otro productor"
            });
        }
        const incidencias = await getIncidenciasProductor(id);

        res.status(200).json({
            ok: true,
            data: incidencias
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}
/**
 * Edita los campos de una incidencia existente.
 * @async
 */
const modificarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, tipo, prioridad, estado, id_cultivo, id_productor } = req.body;

        const incidenciaEditada = await editarIncidencia(
            { titulo, descripcion, tipo, prioridad, estado, id_cultivo, id_productor },
            id
        );

        if (!incidenciaEditada) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontró la incidencia"
            });
        }
        res.json({
            ok: true,
            msg: "Incidencia modificada",
            data: incidenciaEditada
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

/**
 * Elimina permanentemente una incidencia del sistema.
 * @async
 */
const eliminarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await deleteIncidencia(id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: "La incidencia no existe"
            });
        }
        res.json({
            ok: true,
            msg: "Incidencia eliminada con éxito"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

/**
 * Actualiza únicamente el estado de la incidencia (ej: 'pendiente', 'en curso', 'resuelta').
 * @async
 * @param {string} req.body.estado - Nuevo estado.
 */
const actualizarEstadoIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const incidenciaActualizada = await cambiarEstadoIncidencia(id, estado);

        if (!incidenciaActualizada) {
            return res.status(404).json({
                ok: false,
                msg: "Incidencia no encontrada"
            });
        }

        res.json({
            ok: true,
            msg: "Estado actualizado",
            data: incidenciaActualizada
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

/**
 * Actualiza el nivel de prioridad de la incidencia.
 * @async
 * @description Acción restringida a roles de gestión (solo Manager).
 * @param {string} req.body.prioridad - Nivel (alta, media, baja).
 */
const actualizarPrioridadIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { prioridad } = req.body;

        const incidenciaActualizada = await cambiarPrioridadIncidencia(id, prioridad);

        if (!incidenciaActualizada) {
            return res.status(404).json({
                ok: false,
                msg: "Incidencia no encontrada"
            });
        }

        res.json({
            ok: true,
            msg: "Prioridad actualizada",
            data: incidenciaActualizada
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
}

module.exports = {
    crearNuevaIncidencia,
    obtenerTodasIncidencias,
    verIncidenciaById,
    verIncidenciasPorProductor,
    modificarIncidencia,
    eliminarIncidencia,
    actualizarEstadoIncidencia,
    actualizarPrioridadIncidencia
};