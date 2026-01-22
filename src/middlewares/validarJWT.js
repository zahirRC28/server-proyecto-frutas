const jwt = require('jsonwebtoken');

/**
 * Verifica la validez del token JWT enviado en los encabezados de la petición.
 * * @function verificarJWT
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función callback para continuar al siguiente middleware o controlador.
 * @returns {Object|void} Retorna un error 401 o 403 si el token falla; de lo contrario, añade `userToken` a `req`.
 * * @description
 * 1. Extrae el token del encabezado 'Authorization' (espera el formato 'Bearer <token>').
 * 2. Lo verifica contra la clave secreta `process.env.SECRET_KEY`.
 * 3. Inyecta la información decodificada (uid, nombre, rol) en `req.userToken` para su uso posterior.
 */
const verificarJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            ok: false,
            msg: "Token no proporcionadgto o mal formado"
        });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        //console.log(payload)
        const userToken = {
            uid: payload.uid,
            nombre: payload.nombre,
            rol: payload.rol
        };
        //para luego verificar el rol
        req.userToken = userToken;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no válido."
        });
    }
}

module.exports = { verificarJWT };