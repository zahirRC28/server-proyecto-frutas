const queries = {

    // Crear una incidencia
    create: `
        INSERT INTO incidencias (titulo, descripcion, tipo, prioridad, id_cultivo, id_productor)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `,
    // Listar todas las incidencias
    getAll: `
        SELECT i.*, 
        c.nombre AS nombre_cultivo, 
        u.nombre_completo AS nombre_productor
        FROM incidencias i
        JOIN cultivos c ON i.id_cultivo = c.id_cultivo
        JOIN usuarios u ON i.id_productor = u.id_usuario
        ORDER BY i.fecha_creacion DESC;
    `,
    // Obtener por ID
    getPorId: `
        SELECT * FROM incidencias 
        WHERE id_incidencia = $1;
    `,

    // Obtener por productor
    getByProductor: `
        SELECT i.*, 
        c.nombre AS nombre_cultivo,
        u.nombre_completo AS nombre_productor
        FROM incidencias i
        JOIN cultivos c ON i.id_cultivo = c.id_cultivo
        JOIN usuarios u ON i.id_productor = u.id_usuario
        WHERE i.id_productor = $1
        ORDER BY i.fecha_creacion DESC;
    `,

    //Editar incidencia 
    editar: `
        UPDATE incidencias 
        SET titulo = $1, 
        descripcion = $2, 
        tipo = $3, 
        prioridad = $4, 
        estado = $5, 
        id_cultivo = $6, 
        id_productor = $7, 
        fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_incidencia = $8
        RETURNING *;
    `,

    // Eliminar
    delete: `
        DELETE FROM incidencias 
        WHERE id_incidencia = $1 
        RETURNING id_incidencia;
    `,

    // Cambiar estado de Incidencia (Manager, Asesor, Administrador)
    cambiarEstado: `
        UPDATE incidencias 
        SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP 
        WHERE id_incidencia = $2 
        RETURNING *;
    `,

    // Cambiar prioridad de Incidencia (Manager y Administrador)
    cambiarPrioridad: `
        UPDATE incidencias 
        SET prioridad = $1, fecha_actualizacion = CURRENT_TIMESTAMP 
        WHERE id_incidencia = $2 
        RETURNING *;
    `,
};

module.exports = queries;