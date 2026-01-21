const cultivoModel = require('../models/cultivos.model');

const crearCultivo = async (req, res) => {
  try {
    const id_productor = req.userToken.uid;
    const { nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligono } = req.body;

    if (!nombre) return res.status(400).json({ 
        ok: false, 
        msg: 'El nombre es obligatorio' 

    });
    if (!pais) return res.status(400).json({ 
        ok: false, 
        msg: 'pais es obligatorio (codigo 2 letras)' 

    });

    // poligono puede ser objeto o string JSON
    let polObj = null;
    if (poligono) {
      polObj = typeof poligono === 'string' ? JSON.parse(poligono) : poligono;
    }

    const created = await cultivoModel.crearCultivo({
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

const listarCultivos = async (req, res) => {
  try {
    const id_productor = req.userToken.uid;
    const list = await cultivoModel.obtenerCultivosPorProductor(id_productor);
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

const verCultivo = async (req, res) => {
  try {
    const id = req.params.id;
    const id_productor = req.userToken.uid;
    const c = await cultivoModel.obtenerCultivoPorId(id, id_productor);
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

const editarCultivo = async (req, res) => {
  try {
    const id = req.params.id;
    const id_productor = req.userToken.uid;
    const { nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligono } = req.body;

    const polObj = poligono ? (typeof poligono === 'string' ? JSON.parse(poligono) : poligono) : null;

    const updated = await cultivoModel.actualizarCultivo({
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

const eliminarCultivo = async (req, res) => {
  try {
    const id = req.params.id;
    const id_productor = req.userToken.uid;
    const del = await cultivoModel.eliminarCultivo(id, id_productor);
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
  crearCultivo,
  listarCultivos,
  verCultivo,
  editarCultivo,
  eliminarCultivo
};