const Proyectos_DB = require('../models/db_proyectos')
const Tareas_DB = require('../models/db_tareas');


exports.agregarTarea = async (req,res,next) => {
    const proyecto = await Proyectos_DB.findOne({where: { url:req.params.url}});
    
    //console.log(proyecto);
    //console.log(req.body);

    const {tarea} = req.body;

    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar
    const resultado = await Tareas_DB.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstado = async (req,res,next) => {
    //console.log(req.params); //es recomendable usar params para el patch
    
    const {id} = req.params;
    const tarea = await Tareas_DB.findOne({where: {id}});

    //console.log(tarea);

    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req,res) =>{
    const {id} = req.params;

    const resultado = await Tareas_DB.destroy({where: {id}});
    
    
    if(!resultado){
        return next();
    }

    res.status(200).send("Tarea Eliminada");
}