const {crearReporte, actualizarReporte, eliminarReporte, marcarEnviado, obtenerReportePorId, obtenerTodosReportes} = require('../models/reporte.model');
const { obtenerCultivoPorId } = require('../models/cultivos.model');

const crearUnReporte = async (req, res) => {
  try {
    const { id_incidencia = null, titulo, descripcion, id_cultivo } = req.body;
    const id_productor = req.userToken.uid;

    const cultivo = await obtenerCultivoPorId(id_cultivo);
    console.log(cultivo);
    if (!cultivo) {
      return res.status(404).json({ ok: false, msg: 'Cultivo no encontrado' });
    }
    if (cultivo.id_productor !== id_productor) {
      return res.status(403).json({ ok: false, msg: 'No puedes crear reportes de un cultivo ajeno' });
    }

    // Crear el reporte
    const rep = await crearReporte({ id_incidencia, titulo, descripcion, id_productor, id_cultivo });
    return res.status(201).json({ ok: true, report: rep });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

const listarReportes = async (req, res) => {
  const { uid, rol } = req.userToken;
  const reports = await obtenerTodosReportes(rol, uid);
  res.json({ ok: true, count: reports.length, reports });
};

const verReporte = async (req, res) => {
  const id_reporte = req.params.id;
  const { uid, rol } = req.userToken;
  const report = await obtenerReportePorId(id_reporte);

  if (!report) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
  if (rol === 'Productor' && report.id_productor !== uid)
    return res.status(403).json({ ok: false, msg: 'No tienes permisos para ver este reporte' });

  res.json({ ok: true, report });
};

const editarReporte = async (req, res) => {
  const id_reporte = req.params.id;
  const id_productor = req.userToken.uid;
  const { titulo, descripcion } = req.body;

  const updated = await actualizarReporte({ titulo, descripcion }, id_reporte, id_productor);
  if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

  res.json({ ok: true, report: updated });
};

const eliminarUnReporte = async (req, res) => {
  const id_reporte = req.params.id;
  const id_productor = req.userToken.uid;

  const deleted = await eliminarReporte(id_reporte, id_productor);
  if (!deleted) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

  res.json({ ok: true, msg: 'Reporte eliminado' });
};

const enviarReporte = async (req, res) => {
  const id_reporte = req.params.id;
  const id_productor = req.userToken.uid;

  const updated = await marcarEnviado(id_reporte, id_productor);
  if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

  res.json({ ok: true, msg: 'Reporte enviado', report: updated });
};

module.exports = {
  crearUnReporte,
  listarReportes,
  verReporte,
  editarReporte,
  eliminarUnReporte,
  enviarReporte
};