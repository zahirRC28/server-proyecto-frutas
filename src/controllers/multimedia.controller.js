const cloudinary = require('../configs/cloudinary');

const {
  crearMultimedia,
  vincularMultimedia,
  obtenerMultimediaPorEntidad,
  obtenerMultimediaPorId,
  contarVinculos,
  eliminarMultimediaBD,
  eliminarVinculos
} = require('../models/multimedia.model');


const obtenerTipoArchivo = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  return 'other';
};


const subirMultimedia = async (req, res) => {
  const { entidad, id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, msg: 'No se envió ningún archivo' });
    }

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        resource_type: 'auto',
        folder: entidad
      }
    );

    const multimedia = await crearMultimedia({
      tipo: obtenerTipoArchivo(req.file.mimetype),
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    await vincularMultimedia(entidad, id, multimedia.id_multimedia);

    return res.status(201).json({
      ok: true,
      msg: 'Archivo subido correctamente',
      multimedia
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al subir el archivo'
    });
  }
};


const listarMultimediaPorEntidad = async (req, res) => {
  const { entidad, id } = req.params;

  try {
    const archivos = await obtenerMultimediaPorEntidad(entidad, id);

    return res.status(200).json({
      ok: true,
      total: archivos.length,
      archivos
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener archivos'
    });
  }
};


const eliminarMultimedia = async (req, res) => {
  const { id_multimedia } = req.params;

  try {
    const multimedia = await obtenerMultimediaPorId(id_multimedia);
    if (!multimedia) {
      return res.status(404).json({ ok: false, msg: 'Archivo no encontrado' });
    }

    await eliminarVinculos(id_multimedia);

    const usos = await contarVinculos(id_multimedia);

    const resourceTypeMap = {
      image: 'image',
      video: 'video',
      pdf: 'raw',
      other: 'raw'
    };
    const resourceType = resourceTypeMap[multimedia.tipo] || 'raw';
    //console.log(multimedia.public_id)
    //console.log(resourceType);
    if (usos === 0) {
      let resulta
      if (multimedia.public_id) {
        resulta = await cloudinary.uploader.destroy(multimedia.public_id, {
          resource_type: resourceType
        });
        console.log(resulta);
      }
      const { result } = resulta
      //console.log('holaaa')
      await eliminarMultimediaBD(id_multimedia);

      return res.status(200).json({
        ok: true,
        msg: 'Archivo eliminado correctamente'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al eliminar archivo'
    });
  }
};

module.exports = {
  subirMultimedia,
  listarMultimediaPorEntidad,
  eliminarMultimedia
};
