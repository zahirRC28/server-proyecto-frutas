const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir la carpeta dentro de src
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Crear la carpeta si no existe para que no falle el servidor
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Usamos timestamp para evitar colisiones
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filtro para aceptar imágenes y otros archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

module.exports = upload;