const { verificarJWT } = require('./validarJWT');

/**
 * Fabrica un middleware compuesto que valida primero el JWT y luego los permisos de rol.
 * * @function verificarRol
 * @param {Array<string>} rolesPermitidos - Lista de nombres de roles autorizados (ej: ['Manager', 'Admin']).
 * @returns {Array<Function>} Un array de middlewares para ser ejecutados secuencialmente por Express.
 * * @description
 * 1. Ejecuta `verificarJWT` para asegurar que el usuario esté autenticado.
 * 2. Compara el rol extraído del token (`req.userToken.rol`) con la lista de permitidos.
 * 3. Si el rol coincide, permite el acceso; de lo contrario, bloquea con un estado 403.
 */
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