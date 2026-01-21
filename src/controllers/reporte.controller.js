const {crearReporte, actualizarReporte, eliminarReporte, marcarEnviado, obtenerReportePorId, obtenerTodosReportes} = require('../models/reporte.model');

const crearUnReporte = async (req, res) => {
  try {
    const { id_incidencia = null, es_incidencia = false, titulo, descripcion } = req.body;

    const id_productor = req.userToken.uid;

    const rep = await crearReporte({ id_incidencia, es_incidencia, titulo, descripcion, id_productor });
    return res.status(201).json({ ok: true, report: rep });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

const listarReportes = async (req, res) => {
  try {
    const { uid, rol } = req.userToken;
    let reports;

    // Lógica de acceso:
    if (rol === 'Asesor' || rol === 'Manager') {
      // Asesores y Managers ven TODOS los reportes de la base de datos
      reports = await obtenerTodosReportes();
    } else {
      // Los Productores solo ven sus propios reportes
      // Pasamos el uid para que el modelo filtre
      reports = await obtenerTodosReportes(uid);
    }
    return res.status(200).json({
      ok: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

const verReporte = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const { uid, rol } = req.userToken;
    const report = await obtenerReportePorId(id_reporte);
    if (!report) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
    // Si no es Asesor/Manager, verificamos que el id_productor del reporte coincida con el uid del token
    if (rol === 'Productor' && report.id_productor !== uid) {
      return res.status(403).json({
        ok: false,
        msg: 'No tienes permisos para ver este reporte ajeno'
      });
    }
    return res.status(200).json({
      ok: true,
      report
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

const editarReporte = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const id_productor = req.userToken.uid;
    const { titulo, descripcion } = req.body;
    const updated = await actualizarReporte({ titulo, descripcion }, id_reporte, id_productor);
    if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
    return res.json({ ok: true, report: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

const eliminarUnReporte = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const id_productor = req.userToken.uid;
    const deleted = await eliminarReporte(id_reporte, id_productor);
    if (!deleted) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
    return res.json({ ok: true, msg: 'Reporte eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};


const enviarReporte = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const id_productor = req.userToken.uid;
    const updated = await marcarEnviado(id_reporte, id_productor);
    if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

    return res.json({ ok: true, msg: 'Reporte enviado', report: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al enviar reporte' });
  }
};

module.exports = {
  crearUnReporte,
  listarReportes,
  verReporte,
  editarReporte,
  eliminarUnReporte,
  enviarReporte
};