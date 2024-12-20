import { productosServices } from "../../servicios/producto-servicios.js";
import { newRegister } from "./new.js";
import { editRegister } from "./new.js";

const htmlProductos = 
`<div class="card">
    <div class="card-header">
    
    <h3 class="card-title"> 
         <a class="btn bg-dark btn-sm btnAgregarProducto" href="#/newProducto">Agregar Producto</a>
    </h3>   

    </div>
    <!-- /.card-header -->
    <div class="card-body">            
    <table id="productosTable" class="table table-bordered table-striped tableProducto" width="100%">
        <thead>
            <tr>
            <th>#</th>
            <th>Nombre</th> <!-- Nueva columna para el nombre del producto -->
            <th>Código de Barra</th>
            <th>Descripcion</th>
            <th>PC</th>
            <th>PF</th>
            <th>Peso</th>
            <th>Imagen</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
            </tr>
        </thead>
    </table>
    </div>
    <!-- /.card-body -->
</div> `;

export async function Productos(){
    let d = document;
    let res = '';
    d.querySelector('.contenidoTitulo').innerHTML = 'Productos';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Productos";
    d.querySelector('.rutaMenu').setAttribute('href',"#/productos");
    let cP = d.getElementById('contenidoPrincipal');

    res = await productosServices.listar();
    res.forEach(element => {
        element.action = "<div class='btn-group'><a class='btn btn-warning btn-sm mr-1 rounded-circle btnEditarProducto'  href='#/editProducto' data-idProducto='"+ element.id_producto +"'> <i class='fas fa-pencil-alt'></i></a><a class='btn btn-danger btn-sm rounded-circle removeItem btnBorrarProducto'href='#/delProducto' data-idProducto='"+ element.id_producto +"'><i class='fas fa-trash'></i></a></div>";

        // Asegúrate de agregar una imagen predeterminada si no existe ninguna
        element.imagen = element.imagen ? `<img src="${element.imagen}" alt="Producto" width="50" height="50">` : '<img src="https://www.italfren.com.ar/images/catalogo/imagen-no-disponible.jpeg" alt="No disponible" width="50" height="50">';

        // Relacionar la categoría del producto
        element.id_categoria = element.id_categoria ? element.id_categoria : 'Sin categoría';
    });  
    
    cP.innerHTML = htmlProductos;

    llenarTabla(res);

    let btnAgregar = d.querySelector(".btnAgregarProducto");
    let btnEditar = d.querySelectorAll(".btnEditarProducto");
    let btnBorrar = d.querySelectorAll(".btnBorrarProducto");

    btnAgregar.addEventListener("click", agregar);
    for(let i = 0; i < btnEditar.length; i++){
        btnEditar[i].addEventListener("click", editar);
        btnBorrar[i].addEventListener("click", borrar);
    }
}

function agregar(){
    newRegister();
}

function editar() {
    let id = this.getAttribute('data-idProducto');
    console.log("ID del producto:", id); // Para verificar si se está recuperando el id correctamente
    editRegister(id);
}


async function borrar(){
    let id = this.getAttribute('data-idProducto');
    let borrar = 0;
    await Swal.fire({
        title: '¿Está seguro que desea eliminar el producto?',
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
        const borrado = await productosServices.borrar(id);
        Swal.fire({
            icon: 'success',
            title: borrado.message,
            showConfirmButton: true,
            timer: 1500
        });
    }
    window.location.href = "#/productos"; 
}

function llenarTabla(res){
    new DataTable('#productosTable', {
        responsive: true,
        data: res,
        columns: [
            { data: 'id_producto' },
            { data: 'nombre' }, // Nueva columna para el nombre
            { data: 'cod_barra' },
            { data: 'descripcion' },
            { data: 'precio_coste' },
            { data: 'precio_final' },
            { data: 'peso' },
            { data: 'imagen', orderable: false }, // Columna para la imagen
            { data: 'stock' },
            { data: 'id_categoria' }, // Columna para la categoría
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
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending:  ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        }           
    });
}

