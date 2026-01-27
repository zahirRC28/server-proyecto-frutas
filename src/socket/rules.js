/**
 * rules.js
 * Validación de quién puede enviar mensaje a quién
 * Incluye lógica especial para Productor -> Asesor
 */
const { obtenerConversacionEntreUsuarios, obtenerPrimerEmisorDeConversacion } = require('../models/chat.model');

/**
 * Función principal que verifica si un emisor puede enviar mensaje a un receptor
 * @param {number} idEmisor
 * @param {number} idReceptor
 * @param {string} rolEmisor
 * @param {string} rolReceptor
 * @returns {Promise<boolean>}
 */
async function puedeEnviarMensaje(idEmisor, idReceptor, rolEmisor, rolReceptor) {
  if (rolEmisor === 'Administrador') return true;

  if (rolEmisor === 'Manager') {
    //console.log(rolReceptor);
    const confirmacion = ['Productor', 'Asesor','Manager'].includes(rolReceptor);
    console.log(confirmacion);
    if(confirmacion){
      return true;
    }
    return false;
  }

  if (rolEmisor === 'Asesor') {
    const confirmacion = ['Productor', 'Asesor', 'Manager'].includes(rolReceptor);
    if(confirmacion){
      return true;
    }
    return false;
  }

  if (rolEmisor === 'Productor') {
    console.log(rolReceptor);
    console.log(idEmisor,idReceptor);
    // Siempre puede escribir a su Manager
    if (rolReceptor === 'Manager') return true;

    if (rolReceptor === 'Asesor') {
      const idConversacion = await obtenerConversacionEntreUsuarios(idEmisor, idReceptor);
      // El productor NO puede iniciar conversación
      if (!idConversacion) return false;
      // Si ya existe conversación, puede responder
      return true;
    }

    return false;
  }

  return false;
}

module.exports = puedeEnviarMensaje;

