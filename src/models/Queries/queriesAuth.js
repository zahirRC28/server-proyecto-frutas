const queries ={
    obetenerUsuario:`
        SELECT u.id_usuario, u.nombre_completo, u.correo, u.contrasenia_hash, r.nombre AS rol_nombre, u.activo, u.fecha_baja
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.correo = $1;
    `,
    renovarToken:`
        SELECT u.nombre_completo, u.correo, u.contrasenia_hash, r.nombre AS rol_nombre
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE id_usuario = $1
    `
}   
module.exports = queries