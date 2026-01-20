const queries = {
    // Obtener detalle del cultivo -> coge todo de la tabla cultivos + el nombre y el correo del productor
    getCultivoDetalle: `
        SELECT c.*, u.nombre_completo, u.correo
        FROM cultivos c
        INNER JOIN usuarios u ON c.id_productor = u.id_usuario
        WHERE c.id_cultivo = $1;
    `,

    // Obtener mediciones de un cultivo (tendencias/histórico)
    getMedicionesPorCultivo: `
        SELECT * FROM mediciones 
        WHERE id_cultivo = $1
        ORDER BY fecha_hora DESC;
    `
}

module.exports = queries;