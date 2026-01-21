const queries = {
  crearReporte: `
    INSERT INTO reportes (id_incidencia, es_incidencia, titulo, descripcion, id_productor)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `,
  obtenerTodosLosReportes: `
    SELECT r.*, u.nombre_completo AS nombre_productor
    FROM reportes r
    LEFT JOIN usuarios u ON r.id_productor = u.id_usuario
    ORDER BY r.fecha_reporte DESC;
  `,
  verReportePorId: `
    SELECT r.*, u.nombre_completo AS nombre_productor
    FROM reportes r
    LEFT JOIN usuarios u ON r.id_productor = u.id_usuario
    WHERE r.id_reporte = $1;
  `,
  actualizarReporte: `
    UPDATE reportes
    SET titulo = $1, descripcion = $2
    WHERE id_reporte = $3 AND id_productor = $4
    RETURNING *;
  `,
  eliminarReporte: `
    DELETE FROM reportes
    WHERE id_reporte = $1 AND id_productor = $2
    RETURNING *;
  `,
  marcarEnviado: `
    UPDATE reportes
    SET estado = 'sent', fecha_reporte = CURRENT_TIMESTAMP
    WHERE id_reporte = $1 AND id_productor = $2
    RETURNING *;
  `
};

module.exports = queries;