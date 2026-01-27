const {
  obtenerDatosIncidenciaPDF,
  obtenerDatosReportePDF,
  obtenerDatosCultivoPDF
} = require('../models/pdf.model');

const pdfIncidencia = require('../services/pdfIncidencia');
const pdfReporte = require('../services/pdfReporte');
const pdfCultivo = require('../services/pdfCultivo');

const enviarPDF = (res, buffer, nombre) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename=${nombre}.pdf`
  );
  res.send(buffer);
};

const generarPdfIncidencia = async (req, res) => {
  const data = await obtenerDatosIncidenciaPDF(req.params.id);
  if (!data) return res.status(404).json({ msg: 'No encontrada' });

  const pdf = await pdfIncidencia(data);
  enviarPDF(res, pdf, `incidencia_${req.params.id}`);
};

const generarPdfReporte = async (req, res) => {
  const data = await obtenerDatosReportePDF(req.params.id);
  if (!data) return res.status(404).json({ msg: 'No encontrado' });

  const pdf = await pdfReporte(data);
  enviarPDF(res, pdf, `reporte_${req.params.id}`);
};

const generarPdfCultivo = async (req, res) => {
  const data = await obtenerDatosCultivoPDF(req.params.id);
  console.log(data);
  if (!data) return res.status(404).json({ msg: 'No encontrado' });

  const pdf = await pdfCultivo(data);
  enviarPDF(res, pdf, `cultivo_${req.params.id}`);
};

module.exports = {
  generarPdfIncidencia,
  generarPdfReporte,
  generarPdfCultivo
};
