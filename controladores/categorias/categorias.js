import { categoriasServices } from "../../servicios/categoria-servicios.js";
import { newRegister } from "./new.js";
import { editRegister } from "./new.js";

const htmlCategorias = 
`<div class="card">
    <div class="card-header">
    
    <h3 class="card-title"> 
         <a class="btn bg-dark btn-sm btnAgregarCategoria" href="#/newCategoria">Agregar Categoría</a>
    </h3>   

    </div>
    <!-- /.card-header -->
    <div class="card-body">            
    <table id="categoriasTable" class="table table-bordered table-striped tableCategoria" width="100%">
        <thead>
            <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
            </tr>
        </thead>
    </table>
    </div>
    <!-- /.card-body -->
</div> `;

export async function Categorias(){
    let d = document;
    let res = '';
    d.querySelector('.contenidoTitulo').innerHTML = 'Categorías';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Categorías";
    d.querySelector('.rutaMenu').setAttribute('href',"#/categorias");
    let cP = d.getElementById('contenidoPrincipal');

    res = await categoriasServices.listar();
    res.forEach(element => {
        element.action = "<div class='btn-group'><a class='btn btn-warning btn-sm mr-1 rounded-circle btnEditarCategoria' href='#/editCategoria' data-idCategoria='"+ element.id_categoria +"'><i class='fas fa-pencil-alt'></i></a><a class='btn btn-danger btn-sm rounded-circle removeItem btnBorrarCategoria' href='#/delCategoria' data-idCategoria='"+ element.id_categoria +"'><i class='fas fa-trash'></i></a></div>";
    });
    
    cP.innerHTML = htmlCategorias;

    llenarTabla(res);

    let btnAgregar = d.querySelector(".btnAgregarCategoria");
    let btnEditar = d.querySelectorAll(".btnEditarCategoria");
    let btnBorrar = d.querySelectorAll(".btnBorrarCategoria");

    btnAgregar.addEventListener("click", agregar);
    for(let i = 0; i < btnEditar.length; i++){
        btnEditar[i].addEventListener("click", editar);
        btnBorrar[i].addEventListener("click", borrar);
    }
}

function agregar(){
    newRegister();
}

function editar(){
    let id = this.getAttribute('data-idCategoria');
    editRegister(id);
}

async function borrar(){
    let id = this.getAttribute('data-idCategoria');
    let borrar = 0;
    await Swal.fire({
        title: '¿Está seguro que desea eliminar la categoría?',
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: `Cancelar`,
        focusDeny: true
    }).then((result) => {
        if (result.isConfirmed) {
            borrar = 1;
        } else if (result.isDenied) {
            borrar = 0;
            Swal.fire('Se canceló la eliminación', '', 'info');
        }
    });
    if (borrar === 1) {
        const borrado = await categoriasServices.borrar(id);
        Swal.fire({
            icon: 'success',
            title: borrado.message,
            showConfirmButton: true,
            timer: 1500
        });
    }
    window.location.href = "#/categorias"; 
}

function llenarTabla(res){
    new DataTable('#categoriasTable', {
        responsive: true,
        data: res,
        columns: [
            { data: 'id_categoria' },
            { data: 'nombre' }, // Columna para el nombre de la categoría
            { data: 'descripcion' }, // Columna para la descripción
            { data: 'action', orderable: false } // Acciones (editar, borrar)
        ],
        deferRender: true,
        retrieve: true,
        processing: true,
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sSearch:         "Buscar:",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            }
        }           
    });
}
