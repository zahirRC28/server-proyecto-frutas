const queries = {
  crearNotificacion_con_now: `
    INSERT INTO notificaciones (tipo, titulo, mensaje, leido, creado, id_creador, id_receptor)
    VALUES ($1, $2, $3, $4, now(), $5, $6)
    RETURNING *;
  `,
    obtenerNotificacionesPorCreador: `
    SELECT *
    FROM public.notificaciones
    WHERE id_creador = $1
    ORDER BY creado DESC;
  `,

  obtenerNotificacionesPorReceptor: `
    SELECT *
    FROM public.notificaciones
    WHERE id_receptor = $1
    ORDER BY creado DESC;
  `,
  obtenerTodasNotificaciones: `
    SELECT *
    FROM public.notificaciones
    ORDER BY creado DESC;
  `
}

module.exports = queries;