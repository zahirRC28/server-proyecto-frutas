const { JWTgenerator } = require('../helpers/jwt');
const bycrypt = require('bcryptjs');
const { buscarUserLogin, renovarUserID } = require('../models/auth.model')

/**
 * Autentica un usuario y genera un token JWT.
 * * @async
 * @function login
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.correo - Correo electrónico del usuario.
 * @param {string} req.body.contrasenia - Contraseña en texto plano.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con el estado de la autenticación, datos del usuario y el token.
 */
const login = async(req, res) =>{
    const {correo, contrasenia} = req.body
    try {
        //console.log(correo);
        //console.log(contrasenia)
        //comprobamos que el exista un usuario con ese correo
        const usuario = await buscarUserLogin(correo);
        //console.log(usuario)
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "No hay usuario con este email."
            });
        };

        if(usuario.activo === false) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no esta activo."
            });
        }

        //comprobamos que sea la misma contraseña
        const contraBien = await bycrypt.compare(contrasenia, usuario.contrasenia_hash);
        //console.log(contraBien);
        if (!contraBien) {
            return res.status(401).json({
                ok: false,
                msg: "La contraseña no es válida."
            })
        }
        //creamos el payload para el token
        const payload = {
            uid: usuario.id_usuario,
            nombre: usuario.nombre_completo,
            rol: usuario.rol_nombre
        }
        //console.log(payload)
        const token = await JWTgenerator(payload);
        const user = {
            uid: usuario.id_usuario,
            nombre: usuario.nombre_completo,
            correo: usuario.correo,
            rol: usuario.rol_nombre
        }
        //console.log(usuario);
        // Retornar si es primer login
        return res.status(200).json({
            ok: true,
            msg: usuario.primer_login 
                ? "Primer login: se requiere cambiar contraseña"
                : `Login exitoso, bienvenido ${user.nombre}`,
            user,
            token,
            primer_login: usuario.primer_login
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
};

/**
 * Genera un nuevo token JWT válido basado en un token existente y válido.
 * Generalmente utilizado para extender la sesión del usuario.
 * * @async
 * @function renovarToken
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.userToken - Información del usuario extraída previamente por el middleware de validación JWT.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con el nuevo token y datos actualizados del usuario.
 */
const renovarToken = async (req, res) => {
    try {
        //la info biene del middlewere validarJWT
        const { uid, nombre, rol } = req.userToken;

        const payload = { uid, nombre, rol };
        //console.log(payload)
        const token = await JWTgenerator(payload);
        //console.log(token)
        const usuario = await renovarUserID(uid);
        //console.log(usuario);
        return res.status(200).json({
            ok: true,
            msg: 'El token ha sido renovado.',
            user: {
                uid: usuario.id_usuario,
                nombre: usuario.nombre_completo,
                rol: usuario.rol
            },
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
};


module.exports = {
    login,
    renovarToken
}