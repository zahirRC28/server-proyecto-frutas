const { validationResult } = require('express-validator');

/**
 * Verifica si existen errores de validación después de ejecutar los checks de express-validator.
 * * @function checksValidaciones
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función callback para continuar al siguiente middleware o controlador.
 * @returns {Object|void} Retorna una respuesta 400 con los errores si los hay, de lo contrario llama a next().
 * * @description
 * Este middleware debe colocarse siempre después de los checks de validación en las rutas.
 * Si detecta errores, utiliza `errores.mapped()` para devolver un objeto donde la llave es el nombre 
 * del campo fallido, facilitando su lectura en el frontend.
 */
const checksValidaciones = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    };
    next();
}

module.exports = { checksValidaciones };