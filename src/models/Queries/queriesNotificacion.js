const queries = {
  crearNotificacion_con_now: `
    INSERT INTO notificaciones (tipo, titulo, mensaje, leido, creado, id_creador, id_receptor)
    VALUES ($1, $2, $3, $4, now(), $5, $6)
    RETURNING *;
  `
}

module.exports = queries;