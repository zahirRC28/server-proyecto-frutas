const queries = {
    // Obtener detalle del cultivo para el Asesor + nombre y correo del productor (Sin datos geográficos)
    getCultivoDetalle: `
        SELECT 
            c.id_cultivo, 
            c.nombre, 
            c.zona_cultivo, 
            c.tipo_cultivo, 
            c.region, 
            c.pais, 
            c.sistema_riego, 
            c.area_ha, 
            c.fecha_inicio,
            u.nombre_completo AS nombre_productor, 
            u.correo AS correo_productor
        FROM cultivos c
        INNER JOIN usuarios u ON c.id_productor = u.id_usuario
        WHERE c.id_cultivo = $1;
    `,

    // Obtener mediciones del cultivo para análisis (Histórico de parámetros críticos)
    getMedicionesPorCultivo: `
        SELECT 
            id_medicion, 
            fecha_hora, 
            temperatura, 
            humedad_relativa, 
            humedad_suelo, 
            precipitacion, 
            viento_velocidad, 
            viento_direccion,
            evapotranspiracion
        FROM mediciones 
        WHERE id_cultivo = $1
        ORDER BY fecha_hora DESC;
    `
}
module.exports = queries;