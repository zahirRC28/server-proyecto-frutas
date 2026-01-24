const {
  crearReporte,
  actualizarReporte,
  actualizarReporteAsAdmin,
  eliminarReporte,
  eliminarReporteAsAdmin,
  obtenerReportePorId,
  obtenerTodosReportes
} = require('../models/reporte.model');
const { obtenerCultivoPorId } = require('../models/cultivos.model');

const crearUnReporte = async (req, res) => {
  try {
    const { id_incidencia = null, titulo, descripcion, id_cultivo } = req.body;
    const id_productor = req.userToken.uid;

    const cultivo = await obtenerCultivoPorId(id_cultivo);
    if (!cultivo) {
      return res.status(404).json({ ok: false, msg: 'Cultivo no encontrado' });
    }
    if (cultivo.id_productor !== id_productor) {
      return res.status(403).json({ ok: false, msg: 'No puedes crear reportes de un cultivo ajeno' });
    }

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
  const { titulo, descripcion } = req.body;
  const { uid, rol } = req.userToken;

  let updated;
  if (rol === 'Administrador') {
    updated = await actualizarReporteAsAdmin({ titulo, descripcion }, id_reporte);
  } else {
    // Productor (la ruta ya permite Productor y Administrador)
    updated = await actualizarReporte({ titulo, descripcion }, id_reporte, uid);
  }

  if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado o sin permisos' });

  res.json({ ok: true, report: updated });
};

const eliminarUnReporte = async (req, res) => {
  const id_reporte = req.params.id;
  const { uid, rol } = req.userToken;

  let deleted;
  if (rol === 'Administrador') {
    deleted = await eliminarReporteAsAdmin(id_reporte);
  } else {
    // Productor (la ruta permite Productor y Administrador — Manager no puede eliminar)
    deleted = await eliminarReporte(id_reporte, uid);
  }

  if (!deleted) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado o sin permisos' });

  res.json({ ok: true, msg: 'Reporte eliminado' });
};

module.exports = {
  crearUnReporte,
  listarReportes,
  verReporte,
  editarReporte,
  eliminarUnReporte
};