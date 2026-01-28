const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/verificarRol');
const { checksValidaciones } = require('../middlewares/checkValidations');

const {
  generarPdfIncidencia,
  generarPdfReporte,
  generarPdfCultivo
} = require('../controllers/pdf.controller');

// 📄 PDF de INCIDENCIA
router.get(
  '/incidencia/:id',
  [ verificarRol(['Productor','Administrador','Manager','Asesor']) ],
  checksValidaciones,
  generarPdfIncidencia
);

// 📄 PDF de REPORTE
router.get(
  '/reporte/:id',
  [ verificarRol(['Productor','Administrador','Manager','Asesor']) ],
  checksValidaciones,
  generarPdfReporte
);

// 📄 PDF de CULTIVO
router.get(
  '/cultivo/:id',
  [ verificarRol(['Productor','Administrador','Manager','Asesor']) ],
  checksValidaciones,
  generarPdfCultivo
);

module.exports = router;
