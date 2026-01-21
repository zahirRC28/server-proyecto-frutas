const queries = {
    // Obtener detalle del cultivo para el Asesor + nombre y correo del productor (Sin datos geográficos)
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