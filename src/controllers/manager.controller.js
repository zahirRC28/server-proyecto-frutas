const { getManagerDashboard } = require('../models/manager.model');

const dashboardManager = async (req, res) => {
    try {
        const { uid, rol } = req.userToken;

        if (rol !== 'Manager') {
            return res.status(403).json({
                ok: false,
                msg: "Acceso denegado. Solo para Managers."
            });
        }

        const data = await getManagerDashboard(uid);

        const mapaFormateado = data.mapa.map(lote => ({
            id: lote.id_cultivo,
            nombre: lote.nombre_lote,
            productor: lote.productor,
            detalle_area: `${lote.area_ha} ha - ${lote.tipo_cultivo}`,
            coordenadas: {
                centro: lote.centro ? lote.centro.coordinates : null,
                poligono: lote.poligono ? lote.poligono.coordinates : null
            },
            clima: {
                temp: lote.temperatura ? `${lote.temperatura}°C` : 'N/A',
                humedad: lote.humedad_suelo ? `${lote.humedad_suelo}%` : 'N/A',
                lluvia: lote.precipitacion ? `${lote.precipitacion}mm` : '0mm'
            },
            actualizado_hace: lote.ultimo_registro
        }));

        return res.status(200).json({
            ok: true,
            msg: "Dashboard actualizado",
            data: {
                resumen_mapa: mapaFormateado,
                notificaciones_pendientes: data.alertas,
                actividad_campo: data.feed            
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

module.exports = { dashboardManager };