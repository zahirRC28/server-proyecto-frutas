const bcrypt = require('bcryptjs');
const {existeCorreo, obtenerRolByNombre, crearUser, buscarUserByid, 
    actualizarUsuarioId, obtenerTodosRoles, todosUsers, eliminarUserEmail,
    activarUser, desactivarUser, obtenerUsuariosPorRolNombre
} = require('../models/user.model');

const crearUsuario = async(req, res) =>{
    const {nombre, correo, contrasenia, rol} = req.body
        //console.log(nombre);
        //console.log(correo);
        //console.log(contrasenia);
        //console.log(rol);
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
        const salt = bcrypt.genSaltSync();
        const contraseniaEncrip = bcrypt.hashSync(contrasenia, salt);
        //console.log(contraseniaEncrip);
        const values = {
            nombre,
            correo,
            contrasenia:contraseniaEncrip,
            rol
        }
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

const actualizarUsuario = async(req, res) =>{
    const { id } = req.params;
    const {nombre, correo, contrasenia, rol} = req.body
    try {
        const existe = await buscarUserByid(id);
        if(!existe){
            return res.status(400).json({
                ok: false,
                msg: "El usuario con este id no existe"
            });
        }
        //console.log(existe);
        let contrasenaFinal;
        if (contrasenia && contrasenia.trim() !== "") {
            const salt = bcrypt.genSaltSync();
            contrasenaFinal = bcrypt.hashSync(contrasenia, salt);
        } else {
            contrasenaFinal = existe.contrasenia_hash;
        }
        //console.log(contrasenaFinal);
        const datos = {
            nombre,
            correo,
            contrasenia: contrasenaFinal,
            rol
        }
        const userActualizado = await actualizarUsuarioId(datos,id);
        console.log(userActualizado);

        return res.status(200).json({
            ok: true,
            msg: "Usuario fue actualizado correctamente.",
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

const eliminarUser = async(req, res)=>{
    const { id } = req.params;
    const { correo } = req.body;
    try {
        const existe = await buscarUserByid(id);
        if(!existe){
            return res.status(400).json({
                ok: false,
                msg: "El usuario con este id no existe"
            });
        }
        const eliminado = await eliminarUserEmail(correo, id);
        return res.status(200).json({
            ok: true,
            msg: "Usuario fue eliminado correctamente.",
            usuario: eliminado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
}

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

module.exports ={
    crearUsuario,
    actualizarUsuario,
    eliminarUser,
    obtenerUser,
    obtenerTodosUsers,
    todosRoles,
    cambiarEstadoUser,
    usuariosPorRol
}