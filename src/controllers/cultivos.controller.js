const { obtenerCultivos, crearCultivo, obtenerCultivoPorId, actualizarCultivo, eliminarCultivo, obtenerCultivosProductor} = require('../models/cultivos.model');

/**
 * Crea un nuevo registro de cultivo vinculado al productor autenticado.
 * @async
 * @param {Object} req - Request.
 * @param {Object} req.userToken - Información del usuario (inyectada por middleware JWT).
 * @param {string} req.userToken.uid - ID del productor creador.
 * @param {Object} req.body - Datos del cultivo: nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego.
 * @param {string|Object} [req.body.poligono] - Datos GeoJSON del área (se parsea si es string).
 * @returns {Promise<void>} JSON con el cultivo creado.
 */
const crearUnCultivo = async (req, res) => {
  try {
    const id_productor = req.userToken.uid;
    const { nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligono } = req.body;

    // poligono puede ser objeto o string JSON
    let polObj = null;
    if (poligono) {
      polObj = typeof poligono === 'string' ? JSON.parse(poligono) : poligono;
    }
    const created = await crearCultivo({
      nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego,
      poligonoGeoJSON: polObj, id_productor
    });

    return res.status(201).json({ 
        ok: true, 
        cultivo: created 

    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

/**
 * Obtiene la lista completa de todos los cultivos en el sistema.
 * @async
 */
const listarCultivos = async (req, res) => {
  try {
    const list = await obtenerCultivos();
    return res.json({ 
        ok: true, 
        cultivos: list 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

/**
 * Lista los cultivos pertenecientes a un productor específico mediante su ID.
 * @async
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID del productor.
 */
const listarCultivosPorProductor = async (req, res) => {
  try {
    const id_productor = req.params.id;
    const list = await obtenerCultivosProductor(id_productor);
    return res.json({ 
        ok: true, 
        cultivos: list 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

/**
 * Obtiene los detalles de un cultivo específico por su ID único.
 * @async
 */
const verCultivoID = async (req, res) => {
  try {
    const id = req.params.id;
    const c = await obtenerCultivoPorId(id);
    if (!c) return res.status(404).json({ 
        ok: false, 
        msg: 'Cultivo no encontrado' 

    });
    return res.json({ ok: true, cultivo: c });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

/**
 * Actualiza la información de un cultivo existente.
 * Verifica que el cultivo pertenezca al productor que realiza la petición.
 * @async
 */
const editarCultivo = async (req, res) => {
  try {
    const id = req.params.id;
    const id_productor = req.userToken.uid;
    const { nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligono } = req.body;

    const polObj = poligono ? (typeof poligono === 'string' ? JSON.parse(poligono) : poligono) : null;

    const updated = await actualizarCultivo({
      nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego,
      poligonoGeoJSON: polObj
    }, id, id_productor);

    if (!updated) return res.status(404).json({ 
        ok: false, 
        msg: 'No encontrado o sin permisos' 

    });
    return res.json({ ok: true, cultivo: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

/**
 * Elimina un cultivo del sistema.
 * Solo el productor dueño del cultivo tiene permisos para esta acción.
 * @async
 */
const eliminarUnCultivo = async (req, res) => {
  try {
    const id = req.params.id;
    const id_productor = req.userToken.uid;
    const del = await eliminarCultivo(id, id_productor);
    if (!del) return res.status(404).json({ 
        ok: false, 
        msg: 'No encontrado o sin permisos' 

    });
    return res.json({ ok: true, msg: 'Eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

module.exports = {
  crearUnCultivo,
  listarCultivos,
  listarCultivosPorProductor,
  verCultivoID,
  editarCultivo,
  eliminarUnCultivo
};