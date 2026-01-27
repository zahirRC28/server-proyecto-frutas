const { eliminarNotificacionesPorReceptor } = require("../notificacion.model");

const queries = {
  crearNotificacion_con_now: `
    INSERT INTO notificaciones
    (tipo, titulo, mensaje, leido, creado, id_creador, id_receptor, entidad_tipo, entidad_id)
    VALUES ($1,$2,$3,$4,now(),$5,$6,$7,$8)
    RETURNING *
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
  `,

  actualizarLeido: `
    UPDATE public.notificaciones
    SET leido = $1
    WHERE id_notificacion = $2
    AND id_receptor = $3
    RETURNING *;
  `,
  eliminarNotificacionesPorReceptor: `
    DELETE FROM notificaciones
    WHERE id_receptor = $1;
  `
}

module.exports = queries;