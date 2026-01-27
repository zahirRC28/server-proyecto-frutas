const {
  crearDocumento,
  dibujarHeader,
  tablaSimple,
  insertarImagenes
} = require('./pdf.service');

const generarPdfReporte = async (data) => {
  return new Promise(async (resolve) => {
    const doc = crearDocumento();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    dibujarHeader(doc, 'Reporte Técnico');

    tablaSimple(doc, [
      { label: 'Título', value: data.titulo },
      { label: 'Fecha', value: data.fecha_reporte },
      { label: 'Productor', value: data.productor },
      { label: 'Cultivo', value: data.cultivo },
      { label: 'Área (ha)', value: data.area_ha }
    ]);

    doc.fontSize(14).text('Descripción');
    doc.moveDown(0.5);
    doc.fontSize(11).text(data.descripcion);
    doc.moveDown();

    if (data.es_incidencia) {
      doc.fontSize(13).text('Incidencia Asociada', { underline: true });
      doc.moveDown(0.5);
      doc.text(data.incidencia_titulo);
      doc.moveDown(0.3);
      doc.text(data.incidencia_descripcion);
    }

    await insertarImagenes(doc, data.imagenes);

    doc.end();
  });
};

module.exports = generarPdfReporte;
