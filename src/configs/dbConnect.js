const { Pool } = require('pg');
require('dotenv').config();

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