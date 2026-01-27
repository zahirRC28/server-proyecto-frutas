const { Pool } = require('pg');
require('dotenv').config();

/**
 * Pool global de conexiones a PostgreSQL.
 * Se crea UNA SOLA VEZ y se reutiliza en toda la aplicación.
 */
const pool = new Pool({
  connectionString: process.env.STRINGDB,
  ssl: { rejectUnauthorized: false },
  max: 10,                 // máximo de conexiones simultáneas
  idleTimeoutMillis: 30000 // tiempo antes de cerrar conexiones inactivas
});

pool.on('connect', () => {
  console.log('Pool conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool', err);
  process.exit(1);
});

module.exports = pool;
