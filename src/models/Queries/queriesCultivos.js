const queries = {
  crearCultivo: `
    INSERT INTO cultivos (
  nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligono, id_productor
)
VALUES (
  $1, $2, $3, $4, $5, $6,
  ST_SetSRID(ST_GeomFromGeoJSON($7::text), 4326), -- Esto arregla el error del continente
  $8
)
RETURNING *, ST_AsGeoJSON(poligono) as poligono_geojson; -- Esto hace que se dibuje al instante
  `,
  obtenerCultivos: `
    SELECT id_cultivo, nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, area_ha,
           ST_AsGeoJSON(poligono) AS poligono_geojson, created_at
    FROM cultivos
    ORDER BY created_at DESC;
  `,
  obtenerCultivosProductor:`
    SELECT id_cultivo, nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, area_ha,
           ST_AsGeoJSON(poligono) AS poligono_geojson, created_at
    FROM cultivos
    WHERE id_productor = $1
    ORDER BY created_at DESC;
  `,
  obtenerCultivoPorId: `
    SELECT id_cultivo, nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, area_ha,
           ST_AsGeoJSON(poligono) AS poligono_geojson, id_productor, created_at
    FROM cultivos
    WHERE id_cultivo = $1;
  `,
  actualizarCultivo: `
        UPDATE cultivos
    SET
        nombre         = COALESCE($1, nombre),
        zona_cultivo   = COALESCE($2, zona_cultivo),
        tipo_cultivo   = COALESCE($3, tipo_cultivo),
        region         = COALESCE($4, region),
        pais           = COALESCE($5, pais),
        sistema_riego  = COALESCE($6, sistema_riego),
        poligono       = CASE
            WHEN $7::text IS NOT NULL
            THEN ST_SetSRID(ST_GeomFromGeoJSON($7::text), 4326)
            ELSE poligono
        END
    WHERE id_cultivo = $8
      AND id_productor = $9
    RETURNING *;
  `,
  eliminarCultivo: `
    DELETE FROM cultivos
    WHERE id_cultivo = $1 AND id_productor = $2
    RETURNING *;
  `
};

module.exports = queries;