const { verificarJWT } = require('./validarJWT');

const verificarRol = (rolesPermitidos = []) => {
    return [
        verificarJWT,
        (req, res, next) => {
            if (rolesPermitidos.includes(req.userToken.rol)) {
                return next();
            }

            return res.status(403).json({
                ok: false,
                msg: 'No tienes permisos para acceder a esta ruta.'
            });
        }
    ];
};

module.exports = { verificarRol };