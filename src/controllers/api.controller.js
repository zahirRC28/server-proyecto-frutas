const conectar = require("../helpers/fetch");
const FormData = require('form-data');
const fs = require('fs');
const { buscarUserByid } = require('../models/user.model');

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
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor"
        });
    }
};

const getAlertaPlagas = async (req, res) => {
    const { lat, lon, fruta } = req.body;
    console.log('estos son los datos lat, lon y fruta', lat, lon, fruta);
    try {
        if (!lat || !lon || !fruta) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan parámetros: lat, lon y fruta son obligatorios.',

            });
        }

        const params = new URLSearchParams({ lat, lon, fruta });
        const urlFull = `https://aanearana-deteccion-plagas.hf.space/plagas?${params.toString()}`;
        // Llamada a la función conectar
        const info = await conectar(urlFull, 'GET');

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
            msg: "Error interno del servidor en plagas"
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
            data: info.data, // Contiene el array con date, precip_prob...
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

const identificarImagenPlaga = async (req, res) => {
    try {
        // Validar que Multer hizo su trabajo
        if (!req.file) {
            return res.status(400).json({ ok: false, msg: 'No se recibió ninguna imagen' });
        }

        // Preparar FormData para la API externa
        const form = new FormData();
        // Usamos la ruta del archivo que Multer guardó en src/uploads
        form.append('file', fs.createReadStream(req.file.path));

        const urlApi = 'https://aanearana-modelo-deteccion-plagas.hf.space/detect';
        const data = await conectar(urlApi, 'POST', form);

        // Gestionar errores del helper fetch
        if (data.error) {
            return res.status(data.status || 500).json({
                ok: false,
                msg: 'Error en la API de detección',
                error: data.message
            });
        }

        // Enviar éxito al frontend
        return res.status(200).json({
            ok: true,
            msg: 'Análisis de la imagen realizado con éxito',
            detecciones: data.detecciones,
            total: data.total,
        });

    } catch (error) {
        console.error('Error en el controlador de plagas:', error);
        res.status(500).json({ ok: false, msg: 'Error interno en el servidor' });
    }
};

const identificarImagenPlanta = async (req, res) => {
    try {
        // Validamos que Multer haya recibido la foto
        if (!req.file) {
            return res.status(400).json({ ok: false, msg: 'No se recibió ninguna imagen' });
        }
        const form = new FormData();

        // 'image' segun la docu de la API de David
        form.append('image', fs.createReadStream(req.file.path));

        // Llamar a la nueva API
        const urlApi = 'http://18.194.33.82/identificar';

        const data = await conectar(urlApi, 'POST', form);

        // Gestionar la respuesta
        if (data.error || data.status !== 'success') {
            return res.status(500).json({
                ok: false,
                msg: 'Error al identificar la planta',
                error: data.message || 'La API externa no respondió correctamente'
            });
        }

        //Devolvemos los datos al Front
        return res.status(200).json({
            ok: true,
            msg: 'Análisis de la imagen realizado con éxito',
            nombre_cientifico: data.nombre_cientifico,
            nombre_comun: data.nombre_comun,
            otros_nombres: data.otros_nombres,
            precision: data.precision
        });

    } catch (error) {
        console.error('Error en identificarPlanta:', error);
        res.status(500).json({ ok: false, msg: 'Error interno en el servidor' });
    }
};

//Informacion técnica de valor agronómico del suelo (topografía, textura...)
const getInfoSuelo = async (req, res) => {
    try {
        //Recibimos coordenadas del body (del Front)
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan las coordenadas (lat, lon) para el análisis'
            });
        }
        const urlApi = 'http://18.194.33.82:5002/analisis';
        const data = await conectar(urlApi, 'POST', { lat, lon });

        if (data.error) throw new Error(data.message);

        return res.status(200).json({
            ok: true,
            msg: 'Información del suelo obtenida correctamente',
            data
        });

    } catch (error) {
        console.error('Error en getInfoSuelo:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
};

const chatAsistente = async (req, res) => {
    try {
        const { message } = req.body;

        //Obtenemos el uid del token 
        const { uid } = req.userToken;

        if (!message) {
            return res.status(400).json({ ok: false, msg: 'El mensaje es obligatorio' });
        }

        // Usamos función del modelo para traer los datos del usuario
        const usuario = await buscarUserByid(uid);

        if (!usuario || !usuario.correo) {
            return res.status(404).json({
                ok: false,
                msg: 'No se pudo obtener el correo para el chatbot.'
            });
        }

        //Llamada a la API
        const urlApi = 'https://vegetai-labels.onrender.com/chat';

        const data = await conectar(urlApi, 'POST', {
            user_email: usuario.correo, // El correo que sacamos de la BD
            message
        });

        if (data.error || data.response?.includes('Rate limit reached')) {
            return res.status(200).json({ // Enviamos 200 para que el front lo maneje como mensaje
                ok: false, 
                msg: "Lo siento, el asistente no está dispinible ahora mismo. Por favor, inténtalo de nuevo en unos minutos."
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Chatbot conectado correctamente',
            identificado_como: usuario.correo,
            respuesta: data.response
        });

    } catch (error) {
        console.error('Error en Chatbot:', error);
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
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
    getAlertaMeteorologica,
    identificarImagenPlaga,
    identificarImagenPlanta,
    getInfoSuelo,
    chatAsistente
};


