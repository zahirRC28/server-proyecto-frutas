const conectar = require("../helpers/fetch");

const getTemperatura = async (req, res) => {
    try {
        //filtrar por qué cultivo queremos ver datos
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/temperatura`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Temperatura (en Grados Celsius) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getHumedadRelativa = async (req, res) => {
    try {
        //filtrar por qué cultivo queremos ver datos
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/humedad_relativa`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Humedad relativa (%) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getHumedadSuelo = async (req, res) => {
    try {
        //filtrar por qué cultivo queremos ver datos
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/humedad_suelo`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Humedad del suelo (en metros cúbicos) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getPrecipitacion = async (req, res) => {
    try {
        //filtrar por qué cultivo queremos ver datos
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/precipitacion`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Precipitación (mm) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getVientoVelocidad = async (req, res) => {
    try {
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/viento_velocidad`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Velocidad del viento (km/h) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getVientoDireccion = async (req, res) => {
    try {
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/viento_direccion`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Dirección del viento (en grados geográficos) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getEvapotranspiracion = async (req, res) => {
    try {
        const { parcela_id, lat, lon } = req.body;
        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon
        }
        const info = await conectar(`http://18.207.240.23/evapotranspiracion`, 'POST', datos);
        console.log(info);

        return res.status(200).json({
            ok: true,
            msg: 'Evapotranspiracion (mm) obtenida correctamente',
            data: info
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

// Obtener histórico = conjunto de datos entre 2 fechas
const getHistoricoPorFechas = async (req, res) => {
    try {
        const { parcela_id, lat, lon, inicio, fin } = req.body;

        const datos = {
            "parcela_id": parcela_id,
            "lat": lat,
            "lon": lon,
            "inicio": inicio,
            "fin": fin,
            "variables": ["temperatura", "precipitacion", "humedad_suelo", "evapotranspiracion"]
        };

        const info = await conectar(`http://34.201.98.55/cargar_historico`, 'POST', datos);

        return res.status(200).json({
            ok: true,
            msg: 'Histórico de datos obtenido correctamente',
            data: info.historico // Esto ya trae el array con todos los datos mezclados 
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getAlertaPlagas = async (req, res) => {
    try {
        const { latitud, longitud, fruta } = req.query;

        // Validamos que los datos necesarios estén presentes
        if (!latitud || !longitud || !fruta) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan parámetros: latitud, longitud y fruta son obligatorios.'
            });
        }

        // Construir la URL con los parámetros
        const url = `http://44.207.1.251/plagas?latitud=${latitud}&longitud=${longitud}&fruta=${fruta}`;

        const info = await conectar(url, 'GET');

        return res.status(200).json({
            ok: true,
            msg: `Alertas para cultivo de ${fruta}`,
            alertas: info.alertas, // Array con los riesgos de cada plaga
            meteo: info.meteo_data // Datos climáticos que usó el modelo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

//Obtener datos climáticos de los últimos X días
const getAnalisisClimatico = async (req, res) => {
    try {
        // Obtener los parámetros de la URL
        // lat y lon son obligatorios, days es opcional (7 por defecto) 
        const { lat, lon, days } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan parámetros lat o lon'
            });
        }

        // Construir la URL
        const url = `http://98.82.122.18/consultar_datos?lat=${lat}&lon=${lon}&days=${days || 7}`;

        // peticion GET 
        const info = await conectar(url, 'GET');
        console.log("-----Respuesta de la API externa:-----", info);

        return res.status(200).json({
            ok: true,
            msg: 'Análisis climático obtenido con éxito',
            data: info.data, // Contiene el array con date, temp_mean, precip_prob...
            location: info.location
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al conectar con el servicio de análisis climático"
        });
    }
};


const getAlertaMeteorologica = async (req, res) => {
    try {
        // La docu pide: lat, lon, id, cultivo
        const { lat, lon, id, cultivo } = req.body;

        if (!lat || !lon || !id || !cultivo) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan campos obligatorios: lat, lon, id y cultivo.'
            });
        }

        const datos = { lat, lon, id, cultivo };

        // Hacemos el POST
        const info = await conectar(`http://18.184.142.242/monitor`, 'POST', datos);

        return res.status(200).json({
            ok: true,
            msg: 'Predicción de riesgos climáticos realizada correctamente',
            data: info.reporte_7_dias // Aquí viene el array con los estados climáticos
        });

    } catch (error) {
        console.error("Error en Alerta Meteorológica:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

module.exports = {
    getTemperatura,
    getHumedadRelativa,
    getHumedadSuelo,
    getPrecipitacion,
    getVientoVelocidad,
    getVientoDireccion,
    getEvapotranspiracion,
    getHistoricoPorFechas,
    getAlertaPlagas,
    getAnalisisClimatico,
    getAlertaMeteorologica
};


