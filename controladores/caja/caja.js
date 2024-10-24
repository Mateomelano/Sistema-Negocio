import { cajaServices } from "../../servicios/caja-servicios.js";

const htmlCaja = `
<div class="card">
    <div class="card-header">
        <h3 class="card-title"> 
            <span>Caja - Venta de Productos</span>
        </h3>   
    </div>
    <!-- /.card-header -->
    <div class="card-body">            
        <div class="row">
            <div class="col-md-8">
                <!-- Campo para ingresar código de producto o seleccionarlo manualmente -->
                <div class="input-group mb-3">
                    <input type="text" id="codigoProducto" class="form-control" placeholder="Ingrese el código de barras o nombre del producto">
                    <div class="input-group-append">
                        <button id="btnAgregarProducto" class="btn btn-dark">Agregar</button>
                    </div>
                </div>
                <!-- Lista de productos agregados -->
                <div id="listaProductos" class="mt-4"></div>
            </div>
            <div class="col-md-4">
                <!-- Mostrar el total -->
                <h3>Total: $<span id="totalVenta">0.00</span></h3>
                <button id="btnFinalizarVenta" class="btn btn-success btn-lg btn-block mt-4">Realizar Venta</button>
            </div>
        </div>
    </div>
    <!-- /.card-body -->
</div>`;

export async function Caja() {
    debugger
    let d = document;
    let cP = d.getElementById('contenidoPrincipal');
    
    // Actualizar el contenido de la página
    d.querySelector('.contenidoTitulo').innerHTML = 'Caja';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Caja";
    d.querySelector('.rutaMenu').setAttribute('href', "#/caja");

    // Insertar el HTML
    cP.innerHTML = htmlCaja;

    // Variables para productos y total
    let productosAgregados = [];
    let totalVenta = 0.00;

    // Elementos HTML
    const codigoProductoInput = d.getElementById("codigoProducto");
    const btnAgregarProducto = d.getElementById("btnAgregarProducto");
    const listaProductosDiv = d.getElementById("listaProductos");
    const totalVentaSpan = d.getElementById("totalVenta");
    const btnFinalizarVenta = d.getElementById("btnFinalizarVenta");

    // Función para agregar un producto
    async function agregarProducto() {
        const codigo = codigoProductoInput.value.trim();
        if (codigo === "") {
            Swal.fire('Error', 'Por favor ingrese un código de producto.', 'error');
            return;
        }

        // Obtener detalles del producto desde el servicio
        const producto = await cajaServices.obtenerProductoPorCodigo(codigo);
        if (producto) {
            // Agregar el producto a la lista
            productosAgregados.push(producto);

            // Actualizar el total de la venta
            totalVenta += parseFloat(producto.precio);
            totalVentaSpan.innerText = totalVenta.toFixed(2);

            // Mostrar el producto en la lista
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto-item");
            productoDiv.innerHTML = `
                <span>${producto.nombre} - $${producto.precio.toFixed(2)}</span>
                <button class="btn btn-danger btn-sm ml-3 btnQuitarProducto" data-codigo="${producto.id}">Quitar</button>
            `;
            listaProductosDiv.appendChild(productoDiv);

            // Limpiar el campo de entrada
            codigoProductoInput.value = "";
        } else {
            Swal.fire('Error', 'Producto no encontrado.', 'error');
        }
    }

    // Función para quitar un producto
    function quitarProducto(event) {
        if (event.target.classList.contains("btnQuitarProducto")) {
            const codigo = event.target.getAttribute("data-codigo");
            const productoIndex = productosAgregados.findIndex(p => p.id == codigo);
            if (productoIndex !== -1) {
                // Restar el precio del total
                totalVenta -= parseFloat(productosAgregados[productoIndex].precio);
                totalVentaSpan.innerText = totalVenta.toFixed(2);

                // Quitar el producto de la lista
                productosAgregados.splice(productoIndex, 1);
                event.target.parentElement.remove();
            }
        }
    }

    // Función para finalizar la venta
    async function finalizarVenta() {
        if (productosAgregados.length === 0) {
            Swal.fire('Error', 'No hay productos en la venta.', 'error');
            return;
        }

        // Llamar al servicio para realizar la venta
        const response = await cajaServices.realizarVenta(productosAgregados, totalVenta);
        if (response) {
            Swal.fire('Venta realizada', 'La venta se ha realizado exitosamente.', 'success');

            // Resetear los valores
            productosAgregados = [];
            totalVenta = 0.00;
            totalVentaSpan.innerText = totalVenta.toFixed(2);
            listaProductosDiv.innerHTML = "";
        } else {
            Swal.fire('Error', 'Hubo un problema al realizar la venta.', 'error');
        }
    }

    // Listeners
    btnAgregarProducto.addEventListener("click", agregarProducto);
    listaProductosDiv.addEventListener("click", quitarProducto);
    btnFinalizarVenta.addEventListener("click", finalizarVenta);
}
