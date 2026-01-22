const jwt = require("jsonwebtoken");

/**
 * Genera un token JWT firmado utilizando una promesa.
 * * @function JWTgenerator
 * @param {Object} payload - Información que se desea codificar en el token (ej: uid, nombre, rol).
 * @returns {Promise<string>} Una promesa que resuelve al token JWT generado.
 * @throws {Error} Si ocurre un error durante la firma del token (ej: falta la clave secreta).
 * * @example
 * const token = await JWTgenerator({ uid: 1, rol: 'Manager' });
 * * @description
 * Utiliza la clave secreta definida en `process.env.SECRET_KEY`.
 * El token tiene un tiempo de expiración configurado de **2 horas**.
 */
const JWTgenerator = (payload) =>{
    return new Promise((resolve, reject) =>{
        jwt.sign(
            payload, process.env.SECRET_KEY, { expiresIn: "2h" }, (error, token) =>{
                if(error){
                    console.log(error)
                    reject(error);
                }else{
                    resolve(token);
                }
            }
        )
    })
}

module.exports = { JWTgenerator };