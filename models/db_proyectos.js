const Sequelize = require('sequelize');
const slug = require('slug')
const shortid= require('shortid')

const db = require('../config/db') //Importamos la base de datos

const Proyectos = db.define('proyectos',{
    id :{
        type: Sequelize.INTEGER,
        primaryKey: true, //reserverd word
        autoIncrement: true //reserverd word
    },
    nombre : Sequelize.STRING,
    url : Sequelize.STRING
},{
    hooks: { //Ejecutan una función en un determinado tiempo
        beforeCreate(proyecto){ //Se ejecuta antes de crear un nuevo registro
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`; //Genera una URL única y universal
        }
    }
})


module.exports = Proyectos;