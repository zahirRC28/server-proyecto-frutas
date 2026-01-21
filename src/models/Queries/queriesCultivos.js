const queries = {
  crearCultivo: `
    INSERT INTO cultivos (
      nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, poligono, id_productor
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      ST_SetSRID(ST_GeomFromGeoJSON($7::text), 4326),
      $8
    )
    RETURNING *;
  `,
  obtenerCultivos: `
    SELECT id_cultivo, nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, area_ha,
           ST_AsGeoJSON(poligono) AS poligono_geojson, created_at
    FROM cultivos
    ORDER BY created_at DESC;
  `,

  obtenerCultivoPorId: `
    SELECT id_cultivo, nombre, zona_cultivo, tipo_cultivo, region, pais, sistema_riego, area_ha,
           ST_AsGeoJSON(poligono) AS poligono_geojson, created_at
    FROM cultivos
    WHERE id_cultivo = $1;
  `,
  actualizarCultivo: `
    UPDATE cultivos
    SET nombre = $1, zona_cultivo = $2, tipo_cultivo = $3, region = $4, pais = $5, sistema_riego = $6,
        poligono = CASE WHEN $7 IS NOT NULL THEN ST_SetSRID(ST_GeomFromGeoJSON($7::text), 4326) ELSE poligono END
    WHERE id_cultivo = $8 AND id_productor = $9
    RETURNING *;
  `,
  eliminarCultivo: `
    DELETE FROM cultivos
    WHERE id_cultivo = $1 AND id_productor = $2
    RETURNING *;
  `
};

module.exports = queries;