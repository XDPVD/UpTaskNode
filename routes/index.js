const express = require("express");
const router = express.Router();
const proyectoController = require("../controller/proyectocontroller");
const {body} = require('express-validator/check'); //Express validator
const tareasController = require("../controller/tareasController");
const usuariosController = require("../controller/usuariosController");
const authController = require("../controller/authController");

module.exports = function() {

    router.get('/'
        ,authController.usuarioAutenticado
        ,proyectoController.proyectosHome);
    //Para crear un nuevo router tenemos que establecer el endpoint, luego el controlador
    router.get('/nuevo-proyecto',authController.usuarioAutenticado,proyectoController.formularioProyecto);
    
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), //express validator
        //Agarra el body y analiza "nombre"
        proyectoController.nuevoProyecto);

    //Router para los proyectos
    //comidin /:url
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
         proyectoController.proyectoPorURL)


    //Actualizar proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectoController.formularioEditar);

    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        proyectoController.actualizarProyecto);


    //eliminar proyecto
    router.delete('/proyectos/:url',authController.usuarioAutenticado,proyectoController.eliminarProyecto);

    router.post('/proyectos/:url',authController.usuarioAutenticado,tareasController.agregarTarea);

    router.patch('/tareas/:id',authController.usuarioAutenticado,tareasController.cambiarEstado);

    router.delete('/tareas/:id',authController.usuarioAutenticado,tareasController.eliminarTarea);

    router.get('/crear-cuenta',usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',usuariosController.crearCuenta);

    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);

    router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion',authController.cerrarSesion);

    router.get('/reestablecer',usuariosController.formReestablecerPassword);

    router.post('/reestablecer',authController.enviarToken);
    router.get('/reestablecer/:token',authController.validarToken);
    router.post('/reestablecer/:token',authController.actualizarPassword);

    return router;
}