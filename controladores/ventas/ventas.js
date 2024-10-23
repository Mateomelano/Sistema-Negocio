import { ventasServices } from "../../servicios/ventas-servicios.js";
import { newRegister } from "./new.js";
import { editRegister } from "./new.js";

const htmlVentas = 
`<div class="card">
    <div class="card-header">
        <h3 class="card-title"> 
            <a class="btn bg-dark btn-sm btnAgregarVenta" href="#/newVenta">Agregar Venta</a>
        </h3>   
    </div>
    <!-- /.card-header -->
    <div class="card-body">            
    <table id="ventasTable" class="table table-bordered table-striped tableVenta" width="100%">
        <thead>
            <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Productos</th> <!-- Nueva columna para productos -->
                <th>Total</th>
                <th>Tipo de Pago</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        </thead>
    </table>
    </div>
    <!-- /.card-body -->
</div> `;

export async function Ventas() {
    let d = document;
    let res = '';

    // Actualizar el contenido de la página
    d.querySelector('.contenidoTitulo').innerHTML = 'Ventas';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Ventas";
    d.querySelector('.rutaMenu').setAttribute('href', "#/ventas");
    let cP = d.getElementById('contenidoPrincipal');

    // Obtener listado de ventas
    res = await ventasServices.listar();

    // Obtener todos los productos de ventas una sola vez
    const todosLosProductos = await ventasServices.listar2();
    // Para cada venta, filtrar los productos que pertenecen a esa venta
    const ventasConProductos = res.map((venta) => {
        // Filtrar productos por id_venta
        const productos = todosLosProductos.filter(producto => producto.id_venta === venta.id_venta);

        // Mapear los IDs de los productos para mostrar en la tabla
        venta.productos = productos.length > 0 
            ? productos.map(p => p.id_producto).join(", ") 
            : "Sin productos"; // Si no hay productos, mostrar mensaje
        return venta;
    });

    // Agregar las acciones y formatear las fechas
    ventasConProductos.forEach(element => {
        element.action = "<div class='btn-group'><a class='btn btn-warning btn-sm mr-1 rounded-circle btnEditarVenta' href='#/editVenta' data-idVenta='"+ element.id_venta +"'> <i class='fas fa-pencil-alt'></i></a><a class='btn btn-danger btn-sm rounded-circle removeItem btnBorrarVenta' href='#/delVenta' data-idVenta='"+ element.id_venta +"'><i class='fas fa-trash'></i></a></div>";

        // Formatear el tipo de pago para que se muestre correctamente
        element.tipo_pago = element.tipo_pago ? element.tipo_pago : 'Sin especificar';

        // Asegurarse de que la fecha esté en formato adecuado
        element.fecha = new Date(element.fecha).toLocaleDateString();
    });  
    
    // Insertar el HTML y llenar la tabla
    cP.innerHTML = htmlVentas;
    llenarTabla(ventasConProductos);

    let btnAgregar = d.querySelector(".btnAgregarVenta");
    let btnEditar = d.querySelectorAll(".btnEditarVenta");
    let btnBorrar = d.querySelectorAll(".btnBorrarVenta");

    btnAgregar.addEventListener("click", agregar);
    for (let i = 0; i < btnEditar.length; i++) {
        btnEditar[i].addEventListener("click", editar);
        btnBorrar[i].addEventListener("click", borrar);
    }
}


function agregar(){
    newRegister();
}

function editar() {
    let id = this.getAttribute('data-idVenta');
    console.log("ID de la venta:", id); // Para verificar si se está recuperando el id correctamente
    editRegister(id);
}

async function borrar(){
    let id = this.getAttribute('data-idVenta');
    let borrar = 0;
    await Swal.fire({
        title: '¿Está seguro que desea eliminar la venta?',
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
        const borrado = await ventasServices.borrar(id);
        Swal.fire({
            icon: 'success',
            title: borrado.message,
            showConfirmButton: true,
            timer: 1500
        });
    }
    window.location.href = "#/ventas"; 
}

function llenarTabla(res){
    new DataTable('#ventasTable', {
        responsive: true,
        data: res,
        columns: [
            { data: 'id_venta' },
            { data: 'id_usuario' }, // Columna para el usuario
            { data: 'productos' }, // Nueva columna para los productos
            { data: 'total' },
            { data: 'tipo_pago' },
            { data: 'fecha' },
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
