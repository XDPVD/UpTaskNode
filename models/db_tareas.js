const Sequelize = require('sequelize');
const db = require('../config/db');

const Proyecto = require('./db_proyectos');

const slug = require('slug');
const shortid= require('shortid');

const Tareas = db.define('tareas',{
    id:{
        type:Sequelize.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1),
})
Tareas.belongsTo(Proyecto);
//Proyecto.hasMany(Tareas);

module.exports = Tareas;