const bcrypt = require('bcryptjs');
const {existeCorreo, obtenerRolByNombre, crearUser, buscarUserByid, 
    actualizarUsuarioId, obtenerTodosRoles, todosUsers, eliminarUserEmail,
    activarUser, desactivarUser, obtenerUsuariosPorRolNombre, obtenerProductoresSegunRol
} = require('../models/user.model');
const { enviarCorreoVerificacion, enviarCorreo } = require('../helpers/email.js');

/**
 * Registra un nuevo usuario en el sistema con contraseña encriptada.
 * @async
 * @param {Object} req.body - Datos del usuario: nombre, correo, contrasenia, rol, id_manager.
 * @returns {Promise<void>} JSON con el usuario creado o error de validación (email duplicado/rol inexistente).
 */
const crearUsuario = async(req, res) =>{
    const {nombre, correo, rol, id_manager} = req.body
    try {
        //comprobamos que el correo no este registrado
        const existe = await existeCorreo(correo);
        //console.log(existe);
        if(existe){
            return res.status(400).json({
                ok: false,
                msg: "Este correo ya esta registrado"
            });
        }
        //compruebo si el rol existe
        const existerol = await obtenerRolByNombre(rol);
        //console.log(existerol);
        if(!existerol){
            return res.status(400).json({
                ok: false,
                msg: "Este rol no existe"
            });
        }
        //ahora encriptamos la contraseña
        // const salt = bcrypt.genSaltSync();
        // const contraseniaEncrip = bcrypt.hashSync(contrasenia, salt);
        //console.log(contraseniaEncrip);
        // Generar contraseña temporal
        const contrasenaTemporal = Math.random().toString(36).slice(-8);
        const salt = bcrypt.genSaltSync();
        const contraseniaEncrip = bcrypt.hashSync(contrasenaTemporal, salt);

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        const values = {
            nombre,
            correo,
            contrasenia:contraseniaEncrip,
            rol,
            id_manager,
            codigo_verificacion: codigo,
            primer_login: true
        }
        //console.log(values);
        //console.log(contrasenaTemporal);
        await enviarCorreo({
            correo: correo,
            asunto: 'Verificación de cuenta',
            textoPlano: `Bienvenido a Mi App!\n\nTu código de verificación: ${codigo}\nTu contraseña temporal: ${contrasenaTemporal}\n\nUsa esta contraseña para iniciar sesión y cámbiala en tu primer acceso.`,
            textoHTML: `<p>Bienvenido a Mi App!</p>
                    <p>Tu código de verificación: <b>${codigo}</b></p>
                    <p>Tu contraseña temporal: <b>${contrasenaTemporal}</b></p>
                    <p>Usa esta contraseña para iniciar sesión y cámbiala en tu primer acceso.</p>`
        });

        //console.log(values);
        const data = await crearUser(values);
        //console.log(data);

        return res.status(201).json({
            ok: true,
            msg: "Usuario creado correctamente.",
            usuario: data
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
 * Actualiza los datos de un usuario existente.
 * @async
 * @param {string} req.params.id - ID del usuario a actualizar.
 * @description Si se incluye una nueva contraseña, se encripta; de lo contrario, se mantiene la actual.
 */
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    try {
        const existe = await buscarUserByid(id);
        if (!existe) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario con este id no existe"
            });
        }

        const datos = {
            nombre,
            correo,
            contrasenia: existe.contrasenia_hash, // NO se cambia
            rol
        };

        const userActualizado = await actualizarUsuarioId(datos, id);

        return res.status(200).json({
            ok: true,
            msg: "Usuario actualizado correctamente.",
            usuario: userActualizado
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
 * Elimina físicamente a un usuario mediante su ID y correo.
 * @async
 */
const eliminarUser = async(req, res) => {
  const { id } = req.params;
  const { correo } = req.body;

  try {
    // 1) Compruebo que el usuario exista por id
    const existe = await buscarUserByid(id);
    if (!existe) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario con este id no existe"
      });
    }

    // 2) Compruebo que el correo proporcionado coincida con el del usuario (evita borrados por error)
    if (!correo || String((existe.correo || '')).trim().toLowerCase() !== String(correo).trim().toLowerCase()) {
      return res.status(400).json({
        ok: false,
        msg: "El correo proporcionado no coincide con el usuario indicado"
      });
    }

    // 3) Intento eliminar (modelo maneja la transacción)
    const eliminado = await eliminarUserEmail(correo, Number(id));

    // Si la función del modelo devuelve null o vacío, avisamos
    if (!eliminado) {
      return res.status(500).json({
        ok: false,
        msg: "No se pudo eliminar el usuario — consulte los logs del servidor."
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Usuario fue eliminado correctamente.",
      usuario: eliminado
    });
  } catch (error) {
    console.error('Error en controlador eliminarUser:', error.stack || error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor. Consulte su administrador."
    });
  }
};

/**
 * Obtiene el perfil detallado de un usuario por su ID.
 * @async
 */
const obtenerUser = async(req, res) =>{
    const { id } = req.params;
    try {
        const usuario = await buscarUserByid(id);
        console.log(usuario);
        if (!usuario) {
            return res.status(404).json({ 
                ok:false,
                msg: "Usuario no encontrado" 
            });
        }
        return res.status(200).json({
            ok: true,
            msg: "Usuario encontrado correctamente.",
            usuario: usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
}

/**
 * Lista todos los usuarios relacionados con un Manager o la totalidad del sistema.
 * @async
 * @param {string} req.params.id - ID de referencia (usualmente el manager_id).
 */
const obtenerTodosUsers = async(req, res) =>{
    const { id } = req.params;
    try {
        const todosLosUsers = await todosUsers(id);
        return res.status(200).json({
            ok: true,
            msg: "Usuarios encontrados correctamente.",
            usuarios: todosLosUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
}

/**
 * Obtiene el catálogo completo de roles disponibles en la base de datos.
 * @async
 */
const todosRoles = async(req, res)=>{
    try {
        const todosRoles = await obtenerTodosRoles();
        return res.status(200).json({
            ok: true,
            msg: "Estos son todos los roles",
            roles: todosRoles
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
}

/**
 * Alterna el estado (activo/inactivo) de un usuario.
 * @async
 * @description Si el usuario está activo lo desactiva, y viceversa. Útil para suspensiones temporales.
 */
const cambiarEstadoUser = async(req, res)=>{
    const { id } = req.params;
    try {
        const usuario = await buscarUserByid(id);
        if (!usuario) {
            return res.status(404).json({ 
                ok:false,
                msg: "Usuario no encontrado" 
            });
        }
        let userEstadoCambio;
        if(usuario.activo === true){
            userEstadoCambio = await desactivarUser(id);
        }else{
            userEstadoCambio = await activarUser(id);
        }
        return res.status(200).json({
            ok: true,
            msg: "El estado cambio correctamente",
            usuario: userEstadoCambio
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
}

/**
 * Filtra y devuelve usuarios basados en el nombre de su rol.
 * @async
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre - Nombre del rol (ej: 'Productor', 'Manager').
 */
const usuariosPorRol = async(req, res)=>{
    const { nombre } = req.body;
    try{
        //console.log(nombre)
        const usuarios = await obtenerUsuariosPorRolNombre(nombre);
        return res.status(200).json({
            ok: true,
            msg: 'Usuarios por rol obtenidos correctamente.',
            usuarios
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor. Consulte su administrador.'
        });
    }
}


const listarProductores = async (req, res) => {
  try {
    // req.userToken viene de verificarJWT (ejecutado por verificarRol)
    const rolSolicitante = req.userToken?.rol;
    const uidSolicitante = req.userToken?.uid;
    const productores = await obtenerProductoresSegunRol('Productor', rolSolicitante, uidSolicitante);
    return res.status(200).json({
      ok: true,
      msg: 'Productores obtenidos correctamente',
      productores
    });
  } catch (error) {
    console.error('Error en listarProductores:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor. Consulte su administrador.'
    });
  }
};

const cambiarContraseniaPrimerLogin = async (req, res) => {
    const { uid } = req.userToken;
    const { nuevaContrasenia, codigo } = req.body;
    //console.log(uid, nuevaContrasenia, codigo);
    try {
        // Obtenemos el usuario para validar el código
        const usuario = await buscarUserByid(uid);
        if (!usuario) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        // Validamos el código de verificación
        if (usuario.codigo_verificacion !== codigo) {
            return res.status(400).json({ ok: false, msg: 'Código de verificación inválido' });
        }

        // Validamos contraseña fuerte (opcional, si no lo haces en router)
        if (!nuevaContrasenia || nuevaContrasenia.length < 6) {
            return res.status(400).json({ ok: false, msg: 'La contraseña debe tener mínimo 6 caracteres' });
        }

        // Hasheamos la nueva contraseña
        const salt = bcrypt.genSaltSync();
        const contraseniaHash = bcrypt.hashSync(nuevaContrasenia, salt);

        // Actualizamos la contraseña y marcamos primer_login como false, limpiamos código
        await actualizarUsuarioId({ contrasenia: contraseniaHash, primer_login: false, codigo_verificacion: null, correo_verificado: true}, uid);

        await enviarCorreo({
            correo: usuario.correo,
            asunto: 'Contraseña cambiada correctamente',
            textoPlano: 'Tu contraseña ha sido actualizada correctamente.',
            textoHTML: '<p>Tu contraseña ha sido <b>actualizada</b> correctamente.</p>'
        });
        return res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada correctamente, primer login completado.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error del servidor.' });
    }
};

module.exports ={
    crearUsuario,
    actualizarUsuario,
    eliminarUser,
    obtenerUser,
    obtenerTodosUsers,
    todosRoles,
    cambiarEstadoUser,
    usuariosPorRol,
    listarProductores,
    cambiarContraseniaPrimerLogin
}