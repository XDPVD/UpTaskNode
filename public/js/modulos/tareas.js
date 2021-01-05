import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';
const tareas = document.querySelector(".listado-pendientes");

if(tareas){
    tareas.addEventListener('click',e => {
        //console.log(e.target.classList);
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //console.log(idTarea);

            const url = `${location.origin}/tareas/${idTarea}`;

            //console.log(url);

            axios.patch(url, {params:{
              idTarea
            }})
            .then(function(respuesta){
                //console.log(respuesta);
                if(respuesta.status===200){
                    icono.classList.toggle('completo');

                    actualizarAvance();
                }
            });
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                    tareaId = tareaHTML.dataset.tarea;

            //console.log(tareaHTML);
            //console.log(tarea);

            Swal.fire({
                title: '¿Deseas borrar esta tarea?',
                text: "Una tarea eliminado no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar'
              }).then((result) => {
                if (result.isConfirmed) {
                  const url = `${location.origin}/tareas/${tareaId}`;
        
                  //console.log(url);
                  axios.delete(url,{params: {tareaId}})
                  .then(function(res){
                    //console.log(res);
                    tareaHTML.parentElement.removeChild(tareaHTML);

                    Swal.fire(
                        'Tarea Eliminada',
                        res.data
                    );
                    actualizarAvance();
                  });
                }
              })
              .catch(()=>{
                Swal.fire({
                  type:'error',
                  title: 'Hubo un error',
                  text: 'No se pudo eliminar la tarea'
                })
              })

        }
    })
}