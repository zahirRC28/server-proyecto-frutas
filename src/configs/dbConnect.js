const { Pool } = require('pg');
require('dotenv').config();


/**
 * Establece una conexión con la base de datos PostgreSQL utilizando un Pool de conexiones.
 * * @async
 * @function connect
 * @description Crea una instancia de Pool, intenta conectar un cliente y lo devuelve para realizar consultas.
 * @returns {Promise<Object>} Una Promesa que resuelve al cliente de base de datos (client).
 * @throws {Error} Si la conexión falla o las credenciales en process.env.STRINGDB son incorrectas.
 * * @example
 */
const connect = async() =>{
    const pool = new Pool({
        connectionString: process.env.STRINGDB,
        ssl: { rejectUnauthorized: false }
    })
    try {
        const client = await pool.connect();
        console.log('Conectando a la base de datos');
        return client;
    } catch (error) {
        console.log(error, 'Error conectando a la bbdd');
        throw error;
    }
};

module.exports = connect;