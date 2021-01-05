const Usuarios = require("../models/db_usuarios");
const enviarEmail = require("../handlers/email");

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuenta en NodeTask'
    });

    
}

exports.formIniciarSesion = (req,res) => {    
    const {error} = res.locals.mensajes;

    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar sesión en NodeTask',
        error,
    });

    
}

exports.crearCuenta = async (req,res) => {
    //leer los datos
    const {email,password} = req.body;
    //crear el usuario

    try{
        await Usuarios.create({
            email,
            password
        });
        //crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //crear el objeto usuario
        const usuario = {
            email,
        };
        //email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta',
        });
        //redirigir al usuario
        req.flash('correcto','Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');


    }catch(error){
        req.flash('error',error.errors.map(error => error.message));
        
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en NodeTask',
            email, 
            password,
        })
    }
    

    
}

exports.formReestablecerPassword = (req,res) => {
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer tu contraseña',
    });
}

exports.confirmarCuenta = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    //Si no existe el usuario
    if(!usuario){
        req.flash('error','No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto','Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}