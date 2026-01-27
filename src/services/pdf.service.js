const PDFDocument = require('pdfkit');
const axios = require('axios');

const crearDocumento = () => {
  return new PDFDocument({ size: 'A4', margin: 50 });
};

// =======================
// HEADER
// =======================
const dibujarHeader = (doc, titulo) => {
  doc
    .fontSize(20)
    .text('Sistema de Gestión Agrícola', { align: 'left' })
    .moveDown(0.5);

  doc
    .fontSize(14)
    .text(titulo, { align: 'left' })
    .moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown();
};

// =======================
// TABLA SIMPLE (label / value)
// =======================
const tablaSimple = (doc, rows) => {
  rows.forEach(({ label, value }) => {
    doc
      .font('Helvetica-Bold')
      .text(`${label}: `, { continued: true });

    doc
      .font('Helvetica')
      .text(value ?? '-');

    doc.moveDown(0.3);
  });

  doc.moveDown();
};

// =======================
// IMÁGENES DESDE CLOUDINARY
// =======================
const insertarImagenes = async (doc, imagenes = []) => {
  if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0) return;

  doc.addPage();
  doc.fontSize(16).text('Imágenes', { underline: true });
  doc.moveDown();

  for (const img of imagenes) {
    try {
      if (img.url) {
        // Descargamos la imagen como arraybuffer
        const response = await axios.get(img.url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Insertamos la imagen desde buffer
        doc.image(buffer, { fit: [450, 300], align: 'center', valign: 'center' });
        doc.moveDown(0.2);

        // URL debajo
        doc
          .fontSize(9)
          .fillColor('blue')
          .text(img.url, {
            align: 'center',
            link: img.url,
            underline: true
          });
        doc.moveDown(0.5);
        doc.fillColor('black');
      }
    } catch (err) {
      console.error('Error insertando imagen:', img.url, err);
    }
  }
};

module.exports = {
  crearDocumento,
  dibujarHeader,
  tablaSimple,
  insertarImagenes
};
