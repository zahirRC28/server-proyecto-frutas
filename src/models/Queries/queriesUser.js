const queries = {
    crearUsuario:`
        INSERT INTO usuarios (nombre_completo, correo, contrasenia_hash, fecha_ingreso, id_rol)
        SELECT
        $1,
        $2,
        $3,
        CURRENT_DATE,
        r.id_rol
        FROM roles r
        WHERE r.nombre = $4
        RETURNING *;
    `,
    actualizarUsuarioById:`
        UPDATE usuarios
        SET nombre_completo = $1, correo = $2, contrasenia_hash = $3, id_rol = (SELECT id_rol FROM roles WHERE nombre = $4)
        WHERE id_usuario = $5
        RETURNING *;
    `,
    todoLosUserMenosYo:`
        SELECT u.id_usuario, u.nombre_completo, u.correo, r.nombre AS rol_nombre, u.fecha_ingreso, u.activo, u.fecha_baja
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario <> $1;
    `,
    activarUser:`
        UPDATE usuarios
        SET activo = true,
            fecha_baja = NULL
        WHERE id_usuario = $1
        RETURNING *;
    `,
    desactivarUser:`
        UPDATE usuarios
        SET activo = false,
            fecha_baja = NOW()
        WHERE id_usuario = $1
        RETURNING *;
    `,
    eliminarUserById_notificaciones: `
        DELETE FROM notificaciones WHERE id_usuario = $1;
    `,
    eliminarUserByEmail:`
        DELETE 
        FROM usuarios
        WHERE correo = $1
        RETURNING *;
    `,
    obetenerRoles:`
        SELECT *
        FROM roles
    `,
    queRol:`
        SELECT *
        FROM roles
        WHERE nombre = $1;
    `,
    queRolID:`
        SELECT *
        FROM roles
        WHERE id_rol = $1;
    `,
    buscarUser:`
        SELECT *
        FROM usuarios
        WHERE id_usuario = $1
    `,
    correoExiste:`
        SELECT * 
        FROM usuarios 
        WHERE correo = $1
    `
    ,usuariosPorRolNombre:`
        SELECT u.id_usuario, u.nombre_completo, u.correo, r.nombre AS rol_nombre, u.fecha_ingreso, u.activo, u.fecha_baja
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE r.nombre = $1
        ORDER BY u.nombre_completo ASC;
    `
};

module.exports = queries;