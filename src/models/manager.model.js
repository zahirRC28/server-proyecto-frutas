const connect = require('../configs/dbConnect');
const queries = require('./Queries/queriesManager');

const getManagerDashboard = async (idManager) => {
    let cliente;
    try {
        cliente = await connect();

        const [cultivosRes, incidenciasRes, reportesRes] = await Promise.all([
            cliente.query(queries.obtenerCultivosConSensores, [idManager]),
            cliente.query(queries.obtenerIncidenciasPendientes, [idManager]),
            cliente.query(queries.obtenerReportesRecientes, [idManager])
        ]);

        return {
            mapa: cultivosRes.rows,
            alertas: incidenciasRes.rows,
            feed: reportesRes.rows
        };

    } catch (error) {
        console.error("Error en Manager Model:", error);
        throw error;
    } finally {
        if (cliente) cliente.release();
    }
};

module.exports = { getManagerDashboard };