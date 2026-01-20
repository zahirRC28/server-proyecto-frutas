const reportesModel = require('../models/reporte.model');
const path = require('path');

const crearReporte = async (req, res) => {
  try {
    const { id_incidencia = null, es_incidencia = false, titulo, descripcion } = req.body;

    const id_productor = req.userToken.uid;

    const rep = await reportesModel.crearReporte({ id_incidencia, es_incidencia, titulo, descripcion, id_productor });
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
      reports = await reportesModel.obtenerTodosReportes();
    } else {
      // Los Productores solo ven sus propios reportes
      // Pasamos el uid para que el modelo filtre
      reports = await reportesModel.obtenerTodosReportes(uid);
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
    const report = await reportesModel.obtenerReportePorId(id_reporte);
    if (!report) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
    // Si no es Asesor/Manager, verificamos que el id_productor del reporte coincida con el uid del token
    if (rol === 'Productor' && report.id_productor !== uid) {
      return res.status(403).json({
        ok: false,
        msg: 'No tienes permisos para ver este reporte ajeno'
      });
    }
    // Si pasa la validación, buscamos su multimedia
    const multimedia = await reportesModel.obtenerMultimediaPorReporte(id_reporte);
    report.multimedia = multimedia;
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
    const updated = await reportesModel.actualizarReporte({ titulo, descripcion }, id_reporte, id_productor);
    if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
    return res.json({ ok: true, report: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

const eliminarReporte = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const id_productor = req.userToken.uid;
    const deleted = await reportesModel.eliminarReporte(id_reporte, id_productor);
    if (!deleted) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });
    return res.json({ ok: true, msg: 'Reporte eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

// Adjuntar multimedia (videos/images/pdf). req.files proviene de multer.
const uploadMultimedia = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const id_productor = req.userToken.uid;
    const report = await reportesModel.obtenerReportePorId(id_reporte, id_productor);
    if (!report) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

    const files = req.files || [];
    if (files.length === 0) return res.status(400).json({ ok: false, msg: 'No se han enviado archivos' });

    const saved = [];
    for (const f of files) {
      // detecta tipo básico: video/image/pdf
      let tipo = 'file';
      if (f.mimetype && f.mimetype.startsWith('video/')) tipo = 'video';
      else if (f.mimetype && f.mimetype.startsWith('image/')) tipo = 'image';
      else if (f.mimetype === 'application/pdf') tipo = 'pdf';


      const folder = f.destination ? path.basename(f.destination) : 'uploads';
      const url = `/uploads/${folder}/${f.filename}`;

      const meta = await reportesModel.insertarMultimedia(id_reporte, tipo, f.filename, f.mimetype, f.size, url);
      saved.push(meta);
    }
    return res.json({ ok: true, multimedia: saved });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error subiendo multimedia' });
  }
};

const enviarReporte = async (req, res) => {
  try {
    const id_reporte = req.params.id;
    const id_productor = req.userToken.uid;
    const updated = await reportesModel.marcarEnviado(id_reporte, id_productor);
    if (!updated) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

    return res.json({ ok: true, msg: 'Reporte enviado', report: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al enviar reporte' });
  }
};

module.exports = {
  crearReporte,
  listarReportes,
  verReporte,
  editarReporte,
  eliminarReporte,
  uploadMultimedia,
  enviarReporte
};