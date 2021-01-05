const Proyectos_DB = require('../models/db_proyectos')
const slug = require('slug');
const Proyectos = require('../models/db_proyectos');
const Tareas_DB = require('../models/db_tareas');

exports.proyectosHome = async (req,res) =>{


    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos_DB.findAll({where:{usuarioId}}); // 

    

    res.render('index',{
        nombrePagina: 'Proyectos', //De esta manera se pasa un valor al view
        proyectos
    });
    
}

//Se agrega un nuevo controlador
exports.formularioProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos_DB.findAll({where:{usuarioId}});

    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
    
}

exports.nuevoProyecto = async (req,res) => {
    //console.log("\n El valor del formulario enviado es : ")
    //console.log(req.body)
    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos_DB.findAll({where:{usuarioId}});
    const {nombre} = req.body //Desconstruyendo

    let errores = [];

    //Validación pequeña
    if(!nombre){ //Si no hay nombre, entonces agregamos un error
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }
    
    //validando
    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }
    else{
        //cuando no hay errores
        //Insertar en la base de datos

        //Inserta una nueva ocurrencia de entidad
        
        /*Proyectos_DB.create({ nombre }) 
            .then(() => console.log('Insertado correctamente'))
            .catch(error => console.log(error))*/
        

          
        const proyecto = await Proyectos_DB.create({ nombre, usuarioId});
        res.redirect('/')

    }

    
}

exports.proyectoPorURL = async (req,res,next)=>{
    //res.send(req.params.url);
    //Accedemos al comodin establecido en el router, debe tener el mismo nombre
    const usuarioId = res.locals.usuario.id;   
    const proyectosPromise = Proyectos_DB.findAll({where:{usuarioId}});

    const proyectoPromise = Proyectos_DB.findOne({
        where:{
            url: req.params.url //jeje comodin
        }
    });

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    const tareas = await Tareas_DB.findAll({
        where:{
            proyectoId: proyecto.id,
        },
        include : {
            model:Proyectos_DB
        }
    });


    if(!proyecto){
        return next();
    }

    res.render('tareas',{
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async(req,res) =>{
    
    const usuarioId = res.locals.usuario.id;   
    const proyectosPromise = Proyectos_DB.findAll({where:{usuarioId}});
    
    const proyectoPromise = Proyectos_DB.findOne({
        where:{
            id: req.params.id//jeje comodin
        }
    });
    
    /*const proyectos = await Proyectos_DB.findAll();

    const proyecto = await Proyectos_DB.findOne({
        where:{
            id: req.params.id//jeje comodin
        }
    })*/

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise])

    res.render('nuevoProyecto',{
        nombrePagina:'Editar Proyecto',
        proyecto,
        proyectos
    })
}

exports.actualizarProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos_DB.findAll({where:{usuarioId}});
    const {nombre} = req.body //Desconstruyendo

    let errores = [];

    //Validación pequeña
    if(!nombre){ //Si no hay nombre, entonces agregamos un error
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }
    
    //validando
    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }
    else{

        await Proyectos_DB.update({ nombre:nombre },{
            where:{
                id:req.params.id
            }
        })
        res.redirect('/')

    }

}

exports.eliminarProyecto = async (req,res,next) => {
    //console.log(req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos_DB.destroy({
        where:{
            url: urlProyecto
        }
    });

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente')
}