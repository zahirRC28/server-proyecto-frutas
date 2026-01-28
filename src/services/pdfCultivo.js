const {
  crearDocumento,
  dibujarHeader,
  tablaSimple,
  insertarImagenes
} = require('./pdf.service');

const generarPdfCultivo = async (data) => {
  return new Promise(async (resolve) => {
    const doc = crearDocumento();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    dibujarHeader(doc, 'Ficha de Cultivo');

    tablaSimple(doc, [
      { label: 'Nombre', value: data.nombre },
      { label: 'Zona', value: data.zona_cultivo },
      { label: 'Región', value: data.region },
      { label: 'País', value: data.pais },
      { label: 'Sistema de riego', value: data.sistema_riego },
      { label: 'Área (ha)', value: data.area_ha },
      { label: 'Productor', value: data.productor }
    ]);

    await insertarImagenes(doc, data.imagenes);

    doc.end();
  });
};

module.exports = generarPdfCultivo;
