const express = require('express') //Importamos Express

const router = require('./routes') //Importa las rutas

const path = require('path'); //Importa la librería path , sirve para utilizar las direcciones del sistema

const bodyParser = require('body-parser') //Importando bodyparser

const db = require('./config/db'); //Importando el ORM

const helpers = require('./helpers'); //Importando helpers

const passport = require('./config/passport');

const flash = require('connect-flash');

const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: 'variables.env'});

//Archivos internos ./    externos -> "nada"


require('./models/db_proyectos.js'); //Importamos el script del modelo
require('./models/db_tareas.js'); //Importamos el script del modelo
require('./models/db_usuarios.js'); //Importamos el script del modelo

db.sync() //Sincronizamos con la base de datos.
    .then(() => console.log('Conectando al servidor'))
    .catch(error => console.log(error));

const app = express(); //Crea la app express


app.use(bodyParser.urlencoded({extend: true}));



app.use(express.static('public')); //Carga los archivos estáticos


app.set('view engine','pug');
app.set('views',path.join(__dirname,'./views'));

app.use(cookieParser());
app.use(flash());

//sesiones no permite navegar en diferentes páginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    //console.log(req.user);
    res.locals.vardump = helpers.vardump; //res.locals crea variables para que sean accesibles desde
    //cualquier parte de los scripts o vistas
    //console.log("Ejecutan reqFlash para locals mensajes");
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    //console.log(req);
    next();
});


app.use('/',router());

//servidor
const host = process.env.HOST || '0.0.0.0';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


app.listen(3000); //Establece el puerto en el que se crea el servidor

require("./handlers/email");