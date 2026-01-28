const {
  crearDocumento,
  dibujarHeader,
  tablaSimple,
  insertarImagenes
} = require('./pdf.service');

const generarPdfIncidencia = async (data) => {
  return new Promise(async (resolve) => {
    const doc = crearDocumento();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    dibujarHeader(doc, 'Informe de Incidencia');

    tablaSimple(doc, [
      { label: 'Título', value: data.titulo },
      { label: 'Estado', value: data.estado },
      { label: 'Prioridad', value: data.prioridad },
      { label: 'Tipo', value: data.tipo },
      { label: 'Fecha', value: data.fecha_creacion },
      { label: 'Productor', value: data.productor },
      { label: 'Cultivo', value: data.cultivo },
      { label: 'Región', value: data.region }
    ]);

    doc.fontSize(14).text('Descripción');
    doc.moveDown(0.5);
    doc.fontSize(11).text(data.descripcion);
    doc.moveDown();

    await insertarImagenes(doc, data.imagenes);

    doc.end();
  });
};

module.exports = generarPdfIncidencia;
