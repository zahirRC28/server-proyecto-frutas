const queries = {

  crearMultimedia: `
    INSERT INTO multimedia
    (tipo, filename, mimetype, size, url, public_id, provider)
    VALUES ($1, $2, $3, $4, $5, $6, 'cloudinary')
    RETURNING *;
  `,

  obtenerMultimediaPorId: `
    SELECT *
    FROM multimedia
    WHERE id_multimedia = $1;
  `,

  eliminarMultimedia: `
    DELETE FROM multimedia
    WHERE id_multimedia = $1;
  `,

  /* INCIDENCIAS */

  vincularIncidencia: `
    INSERT INTO incidencia_multimedia (id_incidencia, id_multimedia)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `,

  obtenerPorIncidencia: `
    SELECT m.*
    FROM multimedia m
    JOIN incidencia_multimedia im ON im.id_multimedia = m.id_multimedia
    WHERE im.id_incidencia = $1
    ORDER BY m.fecha_subida DESC;
  `,

  eliminarVinculoIncidencia: `
    DELETE FROM incidencia_multimedia
    WHERE id_multimedia = $1;
  `,

  /* REPORTES */

  vincularReporte: `
    INSERT INTO reporte_multimedia (id_reporte, id_multimedia)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `,

  obtenerPorReporte: `
    SELECT m.*
    FROM multimedia m
    JOIN reporte_multimedia rm ON rm.id_multimedia = m.id_multimedia
    WHERE rm.id_reporte = $1
    ORDER BY m.fecha_subida DESC;
  `,

  eliminarVinculoReporte: `
    DELETE FROM reporte_multimedia
    WHERE id_multimedia = $1;
  `,

  /* CULTIVOS */

  vincularCultivo: `
    INSERT INTO cultivo_multimedia (id_cultivo, id_multimedia)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `,

  obtenerPorCultivo: `
    SELECT m.*
    FROM multimedia m
    JOIN cultivo_multimedia cm ON cm.id_multimedia = m.id_multimedia
    WHERE cm.id_cultivo = $1
    ORDER BY m.fecha_subida DESC;
  `,

  eliminarVinculoCultivo: `
    DELETE FROM cultivo_multimedia
    WHERE id_multimedia = $1;
  `,

  /* CONTAR USOS */

  contarVinculos: `
    SELECT
      (SELECT COUNT(*) FROM incidencia_multimedia WHERE id_multimedia = $1) +
      (SELECT COUNT(*) FROM reporte_multimedia WHERE id_multimedia = $1) +
      (SELECT COUNT(*) FROM cultivo_multimedia WHERE id_multimedia = $1)
      AS total;
  `
};

module.exports = queries;
