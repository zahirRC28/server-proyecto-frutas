-- ===============================
-- :one: ACTIVAR POSTGIS (OBLIGATORIO)
-- ===============================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ===============================
-- :two: LIMPIEZA DE TABLAS
-- ===============================
DROP TABLE IF EXISTS reporte_multimedia CASCADE;
DROP TABLE IF EXISTS reportes CASCADE;
DROP TABLE IF EXISTS incidencias CASCADE;
DROP TABLE IF EXISTS mediciones CASCADE;
DROP TABLE IF EXISTS cultivos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ===============================
-- :three: TABLA ROLES
-- ===============================
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- ===============================
-- :four: TABLA USUARIOS
-- ===============================

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasenia_hash VARCHAR(255) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_baja TIMESTAMP,
    id_rol INT NOT NULL REFERENCES roles(id_rol)
);


-- ===============================
-- :five: TABLA CULTIVOS (POSTGIS)
-- ===============================
CREATE TABLE cultivos (
    id_cultivo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    zona_cultivo VARCHAR(100),
    tipo_cultivo VARCHAR(50),
    region VARCHAR(50),
    pais CHAR(2) NOT NULL,
    sistema_riego VARCHAR(50),
    area_ha DECIMAL(10,4),
    poligono GEOMETRY(POLYGON, 4326) NOT NULL,
    centroide GEOMETRY(POINT, 4326),
    bbox GEOMETRY(POLYGON, 4326),
    fecha_inicio DATE,
    fecha_fin DATE,
    id_productor INT NOT NULL REFERENCES usuarios(id_usuario),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- :six: ÍNDICES (RENDIMIENTO)
-- ===============================45
CREATE INDEX idx_cultivos_poligono ON cultivos USING GIST (poligono);
CREATE INDEX idx_cultivos_centroide ON cultivos USING GIST (centroide);
CREATE INDEX idx_cultivos_productor ON cultivos (id_productor);

-- ===============================
-- :seven: TRIGGER GEOMÉTRICO AUTOMÁTICO
-- ===============================
CREATE OR REPLACE FUNCTION calcular_datos_geometricos()
RETURNS TRIGGER AS $$
BEGIN
    NEW.centroide := ST_Centroid(NEW.poligono);
    NEW.bbox := ST_Envelope(NEW.poligono);
    NEW.area_ha := ST_Area(NEW.poligono::geography) / 10000;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cultivos_geo
BEFORE INSERT OR UPDATE ON cultivos
FOR EACH ROW
EXECUTE FUNCTION calcular_datos_geometricos();

-- ===============================
-- :eight: TABLA MEDICIONES
-- ===============================
CREATE TABLE mediciones (
    id_medicion SERIAL PRIMARY KEY,
    id_cultivo INT NOT NULL REFERENCES cultivos(id_cultivo) ON DELETE CASCADE,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperatura DECIMAL(5,2),
    humedad_relativa DECIMAL(5,2) CHECK (humedad_relativa BETWEEN 0 AND 100),
    humedad_suelo DECIMAL(5,2) CHECK (humedad_suelo BETWEEN 0 AND 100),
    precipitacion DECIMAL(6,2),
    viento_velocidad DECIMAL(5,2),
    viento_direccion SMALLINT CHECK (viento_direccion BETWEEN 0 AND 360),
    evapotranspiracion DECIMAL(6,2)
);

CREATE INDEX idx_mediciones_cultivo_fecha ON mediciones (id_cultivo, fecha_hora);

-- ===============================
-- :nine: TABLA INCIDENCIAS
-- ===============================
CREATE TABLE incidencias (
    id_incidencia SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50),
    prioridad VARCHAR(20) DEFAULT 'media',
    estado VARCHAR(20) DEFAULT 'abierta',
    id_cultivo INT NOT NULL REFERENCES cultivos(id_cultivo),
    id_productor INT NOT NULL REFERENCES usuarios(id_usuario),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incidencias_productor ON incidencias (id_productor);
CREATE INDEX idx_incidencias_cultivo ON incidencias (id_cultivo);

-- ===============================
-- :keycap_ten: TABLA REPORTES (CON O SIN INCIDENCIA)
-- ===============================
CREATE TABLE reportes (
    id_reporte SERIAL PRIMARY KEY,
    id_incidencia INT REFERENCES incidencias(id_incidencia) ON DELETE SET NULL, -- opcional
    es_incidencia BOOLEAN DEFAULT FALSE, -- TRUE si hay id_incidencia, FALSE si no
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_productor INT NOT NULL REFERENCES usuarios(id_usuario), -- quien genera el reporte
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reportes_incidencia ON reportes (id_incidencia);

-- ===============================
-- :one::one: TABLA MULTIMEDIA (METADATOS)
-- ===============================
CREATE TABLE reporte_multimedia (
    id_multimedia SERIAL PRIMARY KEY,
    id_reporte INT NOT NULL REFERENCES reportes(id_reporte) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- image | video | pdf
    filename VARCHAR(255) NOT NULL,
    mimetype VARCHAR(100),
    size INT,
    url TEXT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_multimedia_reporte ON reporte_multimedia (id_reporte);

-- ===============================
-- :one::two: TRIGGER PARA ACTUALIZAR FECHA DE INCIDENCIAS
-- ===============================
CREATE OR REPLACE FUNCTION actualizar_es_incidencia()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_incidencia IS NOT NULL THEN
        NEW.es_incidencia := TRUE;
    ELSE
        NEW.es_incidencia := FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reportes_es_incidencia
BEFORE INSERT OR UPDATE ON reportes
FOR EACH ROW
EXECUTE FUNCTION actualizar_es_incidencia();

-- ===============================
-- :one::three: DATOS INICIALES
-- ===============================
INSERT INTO roles (nombre) VALUES
('Administrador'),
('Manager'),
('Asesor'),
('Productor');
--- me hace falta para mis relaciones
ALTER TABLE usuarios ADD COLUMN id_manager INT REFERENCES usuarios(id_usuario);