const crearUnaNotificacion = require('../models/notificacion.model');

const crearNotificacion = async (req, res) => {
  try {
    const { tipo, titulo, mensaje, leido = false, id_receptor } = req.body;
    const id_creador = req.userToken && req.userToken.uid;

    if (!id_creador) {
      return res.status(401).json({ 
        ok: false, 
        msg: 'Usuario no autenticado' 
    });
    }

    if (!tipo || !titulo || !mensaje || !id_receptor) {
      return res.status(400).json({
        ok: false,
        msg: 'Campos requeridos: tipo, titulo, mensaje, id_receptor'
      });
    }

    const nuevaNotificacion = await crearUnaNotificacion({
      tipo,
      titulo,
      mensaje,
      leido,
      id_creador,
      id_receptor
    });

    return res.status(201).json({ 
        ok: true, 
        notification: nuevaNotificacion 
    });

  } catch (error) {
    console.error('Error en crearNotificacion:', error);
    return res.status(500).json({ 
        ok: false, 
        msg: 'Error del servidor' 

    });
  }
};

module.exports = { crearNotificacion };