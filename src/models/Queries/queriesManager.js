const queries = {
    // 1. MAPA Y CLIMA (Cultivos + Última Medición)
    obtenerCultivosConSensores: `
        SELECT 
            c.id_cultivo, 
            c.nombre AS nombre_lote, 
            c.tipo_cultivo, 
            c.area_ha,
            u.nombre_completo AS productor,
            -- Convertimos geometría a GeoJSON
            ST_AsGeoJSON(c.centroide)::json AS centro,
            ST_AsGeoJSON(c.poligono)::json AS poligono,
            -- Traemos la última medición disponible (Temperatura/Humedad)
            m.temperatura,
            m.humedad_suelo,
            m.precipitacion,
            m.fecha_hora AS ultimo_registro
        FROM cultivos c
        INNER JOIN usuarios u ON c.id_productor = u.id_usuario
        LEFT JOIN LATERAL (
            SELECT temperatura, humedad_suelo, precipitacion, fecha_hora
            FROM mediciones 
            WHERE id_cultivo = c.id_cultivo 
            ORDER BY fecha_hora DESC 
            LIMIT 1
        ) m ON true
        WHERE u.id_manager = $1; 
    `,

    // 2. NOTIFICACIONES (Incidencias Activas)
    obtenerIncidenciasPendientes: `
        SELECT 
            i.id_incidencia, 
            i.titulo, 
            i.prioridad, 
            i.estado, 
            i.fecha_creacion,
            c.nombre AS lote,
            u.nombre_completo AS productor
        FROM incidencias i
        INNER JOIN cultivos c ON i.id_cultivo = c.id_cultivo
        INNER JOIN usuarios u ON i.id_productor = u.id_usuario
        WHERE u.id_manager = $1 
        AND i.estado = 'abierta'
        ORDER BY i.prioridad DESC, i.fecha_creacion DESC;
    `,

    // 3. ACTIVIDAD RECIENTE (Últimos Reportes)
    obtenerReportesRecientes: `
        SELECT 
            r.id_reporte, 
            r.titulo, 
            r.descripcion, 
            r.fecha_reporte,
            u.nombre_completo AS productor,
            -- Contamos si subieron fotos/videos
            (SELECT COUNT(*) FROM reporte_multimedia rm WHERE rm.id_reporte = r.id_reporte) as adjuntos
        FROM reportes r
        INNER JOIN usuarios u ON r.id_productor = u.id_usuario
        WHERE u.id_manager = $1
        ORDER BY r.fecha_reporte DESC
        LIMIT 10;
    `
};

module.exports = queries;