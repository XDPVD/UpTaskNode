const passport = require('passport');

const Usuarios = require('../models/db_usuarios');

const crypto = require('crypto');

const Op = require('sequelize').Op;

const bcrypt = require('bcrypt-nodejs');

const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios',
});

exports.usuarioAutenticado = (req,res,next) => {
    //usuario autenticado
    console.log("REQ en UsuarioAutenticado?");
    console.log(req.user);
    if(req.isAuthenticated()){
        return next();
    }

    //sino redirigir al formulario
    return res.redirect('/iniciar-sesion');
    
};

exports.cerrarSesion = (req,res,next) =>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    });
}

exports.enviarToken = async(req,res) => {
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where:{email}});

    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.render('reestablecer',{
            nombrePagina: 'Reestablecer tu contraseña',
            mensajes: req.flash(),
        });
    }

    usuario.token = crypto.randomBytes(20).toString('hex');

    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el correo
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password',
    });

    req.flash('correcto','Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
    }});

    if(!usuario){
        req.flash('error','No válido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword',{
        nombrePagina:'Reestablecer Password',
    });
}

exports.actualizarPassword = async (req,res) => {
    // Verifica el token valido pero también la fecha de expiración
    console.log("Usuario antes de findone");
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            },
        },
    });
    console.log("Usuario despues de findone");
    // verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password
    console.log(usuario, "USUARIO");
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    console.log(usuario, "USUARIO");
    // guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}