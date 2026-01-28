const queries = {

  // =========================
  // 📄 INCIDENCIA COMPLETA
  // =========================
  obtenerIncidenciaCompleta: `
    SELECT
      i.id_incidencia,
      i.titulo,
      i.descripcion,
      i.tipo,
      i.prioridad,
      i.estado,
      i.fecha_creacion,
      i.fecha_actualizacion,

      u.id_usuario AS productor_id,
      u.nombre_completo AS productor,
      u.correo AS productor_correo,

      c.id_cultivo,
      c.nombre AS cultivo,
      c.zona_cultivo,
      c.region,
      c.pais,
      c.area_ha,

      COALESCE(
        json_agg(
          json_build_object(
            'id_multimedia', m.id_multimedia,
            'tipo', m.tipo,
            'url', m.url,
            'filename', m.filename,
            'provider', m.provider
          )
        ) FILTER (WHERE m.id_multimedia IS NOT NULL),
        '[]'
      ) AS imagenes

    FROM incidencias i
    JOIN usuarios u ON i.id_productor = u.id_usuario
    JOIN cultivos c ON i.id_cultivo = c.id_cultivo
    LEFT JOIN incidencia_multimedia im ON i.id_incidencia = im.id_incidencia
    LEFT JOIN multimedia m ON im.id_multimedia = m.id_multimedia
    WHERE i.id_incidencia = $1
    GROUP BY i.id_incidencia, u.id_usuario, c.id_cultivo;
  `,

  // =========================
  // 📄 REPORTE COMPLETO
  // =========================
  obtenerReporteCompleto: `
    SELECT
      r.id_reporte,
      r.titulo,
      r.descripcion,
      r.es_incidencia,
      r.fecha_reporte,

      u.id_usuario AS productor_id,
      u.nombre_completo AS productor,
      u.correo AS productor_correo,

      c.id_cultivo,
      c.nombre AS cultivo,
      c.zona_cultivo,
      c.region,
      c.pais,
      c.area_ha,

      i.id_incidencia AS incidencia_id,
      i.titulo AS incidencia_titulo,
      i.descripcion AS incidencia_descripcion,

      COALESCE(
        json_agg(
          json_build_object(
            'id_multimedia', m.id_multimedia,
            'tipo', m.tipo,
            'url', m.url,
            'filename', m.filename,
            'provider', m.provider
          )
        ) FILTER (WHERE m.id_multimedia IS NOT NULL),
        '[]'
      ) AS imagenes

    FROM reportes r
    JOIN usuarios u ON r.id_productor = u.id_usuario
    JOIN cultivos c ON r.id_cultivo = c.id_cultivo
    LEFT JOIN incidencias i ON r.id_incidencia = i.id_incidencia
    LEFT JOIN reporte_multimedia rm ON r.id_reporte = rm.id_reporte
    LEFT JOIN multimedia m ON rm.id_multimedia = m.id_multimedia
    WHERE r.id_reporte = $1
    GROUP BY r.id_reporte, u.id_usuario, c.id_cultivo, i.id_incidencia;
  `,

  // =========================
  // 📄 CULTIVO COMPLETO
  // =========================
  obtenerCultivoCompleto: `
    SELECT
      c.id_cultivo,
      c.nombre,
      c.tipo_cultivo,
      c.zona_cultivo,
      c.region,
      c.pais,
      c.sistema_riego,
      c.area_ha,
      ST_AsGeoJSON(c.poligono) AS poligono_geojson,
      ST_AsGeoJSON(c.centroide) AS centroide_geojson,
      ST_AsGeoJSON(c.bbox) AS bbox_geojson,

      u.id_usuario AS productor_id,
      u.nombre_completo AS productor,
      u.correo AS productor_correo,

      COALESCE(
        json_agg(
          json_build_object(
            'id_multimedia', m.id_multimedia,
            'tipo', m.tipo,
            'url', m.url,
            'filename', m.filename,
            'provider', m.provider,
            'es_principal', cm.es_principal
          )
        ) FILTER (WHERE m.id_multimedia IS NOT NULL),
        '[]'
      ) AS imagenes

    FROM cultivos c
    JOIN usuarios u ON c.id_productor = u.id_usuario
    LEFT JOIN cultivo_multimedia cm ON c.id_cultivo = cm.id_cultivo
    LEFT JOIN multimedia m ON cm.id_multimedia = m.id_multimedia
    WHERE c.id_cultivo = $1
    GROUP BY c.id_cultivo, u.id_usuario;
  `
};

module.exports = queries;

