const {
    crearIncidencia,
    getTodasIncidencias,
    getIncidenciaById,
    getIncidenciasProductor,
    editarIncidencia,
    cambiarEstadoIncidencia,
    cambiarPrioridadIncidencia,
    deleteIncidencia } = require('../models/incidencias.model');

// Crear incidencia (Prodcutor)
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

// Ver TODAS las incidencias
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

// Ver incidencia por id
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

// Ver todas las incidencias de un productor
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
//Editar una incidencia
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

//Eliminar incidencia
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

//Cambiar estado de Incidencia
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

// Cambiar Prioridad de la Incidencia (alta, media o baja -> SOLO EL MANAGER)
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