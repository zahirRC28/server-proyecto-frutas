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
  try {
    const { uid, rol } = req.userToken;
    const reports = await obtenerTodosReportes(rol, uid);

    return res.status(200).json({
      ok: true,
      msg: 'Reportes obtenidos correctamente',
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error del servidor al obtener los reportes' });
  }
};

const listarReportesDeUnProductor = async (req, res) => {
  try {
    const { id } = req.params; // id del productor que queremos consultar
    const { uid, rol } = req.userToken; // id y Rol del que hace la petición

    //Si es Productor y el ID no es el suyo, fuera.
    if (rol === 'Productor' && uid != id) {
      return res.status(403).json({
        ok: false,
        msg: 'No tienes permiso para ver reportes ajenos'
      });
    }
    // pasar id que viene de la URL
    const reportes = await obtenerTodosReportes('Productor', id);

    res.json({
      ok: true,
      msg: 'Reportes por productor obtenidos correctamente',
      count: reportes.length,
      reportes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error del servidor al obtener reportes del productor' });
  }
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
  listarReportesDeUnProductor,
  verReporte,
  editarReporte,
  eliminarUnReporte
};