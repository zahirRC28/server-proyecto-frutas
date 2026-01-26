const queries = {
  crearConversacion: `
    WITH ins AS (
      INSERT INTO conversaciones (
        usuario_menor,
        usuario_mayor,
        creada_por
      )
      VALUES (
        LEAST($1::int, $2::int),
        GREATEST($1::int, $2::int),
        $1::int
      )
      ON CONFLICT ON CONSTRAINT uq_conversacion_usuarios
      DO NOTHING
      RETURNING *
    )
    SELECT * FROM ins
    UNION
    SELECT *
    FROM conversaciones
    WHERE usuario_menor = LEAST($1::int, $2::int)
      AND usuario_mayor = GREATEST($1::int, $2::int);
  `,
  obtenerConversacionesUsuario: `
    SELECT 
      c.*,
      u.nombre_completo,
      r.nombre AS rol_otro_usuario
    FROM conversaciones c
    JOIN usuarios u
      ON u.id_usuario = CASE
        WHEN c.usuario_menor = $1 THEN c.usuario_mayor
        ELSE c.usuario_menor
      END
    JOIN roles r
      ON u.id_rol = r.id_rol
    WHERE c.usuario_menor = $1
      OR c.usuario_mayor = $1
    ORDER BY c.creada DESC;
  `,

  obtenerMensajesConversacion: `
    SELECT *
    FROM mensajes
    WHERE id_conversacion = $1
    ORDER BY enviado ASC;
  `,

  insertarMensaje: `
    INSERT INTO mensajes (id_conversacion, id_emisor, contenido)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,

  conversacionHabilitada: `
    SELECT habilitada
    FROM conversaciones
    WHERE id_conversacion = $1;
  `,
  marcarMensajesLeidos: `
    UPDATE mensajes
    SET leido = TRUE
    WHERE id_conversacion = $1
      AND id_emisor <> $2
      AND leido = FALSE;
  `,
  rolUsuario: `
    SELECT r.nombre 
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    WHERE id_usuario = $1
  `,
  obstenerUnaConversacion:`
    SELECT id_conversacion
    FROM conversaciones
    WHERE usuario_menor = LEAST($1::int, $2::int)
      AND usuario_mayor = GREATEST($1::int, $2::int)
    LIMIT 1;
  `,
  obetenerFirstEmisor:`
    SELECT id_emisor
    FROM mensajes
    WHERE id_conversacion = $1
    ORDER BY enviado ASC
    LIMIT 1;
  `,
  TodosposiblesChats: `
    SELECT u.id_usuario, u.nombre_completo, r.nombre as rol_otro_usuario
    FROM usuarios u
    JOIN roles r ON r.id_rol = u.id_rol
    WHERE u.id_usuario != $1
    ORDER BY u.nombre_completo ASC;
  `,

  TodosAsesoresManagersYProductoresDelManager: `
    SELECT u.id_usuario, u.nombre_completo, r.nombre AS rol_otro_usuario, u.id_manager
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario != $1
      AND (
        r.nombre IN ('Asesor','Manager') OR
        (r.nombre = 'Productor' AND u.id_manager = $1)
      )
    ORDER BY u.nombre_completo ASC;
  `,

  TodosAsesoresManagersYAsesores: `
    SELECT u.id_usuario, u.nombre_completo, r.nombre AS rol_otro_usuario, u.id_manager
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario != $1
      AND r.nombre IN ('Productor','Manager','Asesor')
    ORDER BY u.nombre_completo ASC;
  `,

  SoloMiManager: `
    SELECT u.id_usuario, u.nombre_completo, r.nombre AS rol_otro_usuario, u.id_manager
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = $1
  `
};

module.exports = queries;
