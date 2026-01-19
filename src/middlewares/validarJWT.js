const jwt = require('jsonwebtoken');

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