const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/db_usuarios');

//local strategy

passport.use(
    new LocalStrategy(
        //por default passport espera un correo y contraseña
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            
            try{
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1,
                    },
                });
                //El usuario existe, pero la contraseña es incorrecta
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message : 'Password Incorrecto',
                    });
                }

                return done(null,usuario);
            }catch(error){
                //El usuario no existe

                return done(null, false, {
                    message : 'Esa cuenta no existe',
                });
            }
        }
    )
);


//Serializar el usuario
passport.serializeUser((usuario,callback) => {
    callback(null,usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario);
});

module.exports = passport;