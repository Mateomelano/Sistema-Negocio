import { cajaServices } from "../../servicios/caja-servicios.js";

const htmlCaja = `
<div class="card">
    <div class="card-header">
        <h3 class="card-title"> 
            <span>Caja - Venta de Productos</span>
        </h3>   
    </div>
    <div class="card-body">            
        <div class="row">
            <div class="col-md-8">
                <div class="input-group mb-3">
                    <input type="text" id="codigoProducto" class="form-control" placeholder="Ingrese el código de barras o nombre del producto">
                    <div class="input-group-append">
                        <button id="btnAgregarProducto" class="btn btn-dark">Agregar</button>
                    </div>
                </div>
                <div id="listaProductos" class="mt-4"></div>
            </div>
            <div class="col-md-4">
                <h3>Total: $<span id="totalVenta">0.00</span></h3>
                <button id="btnFinalizarVenta" class="btn btn-success btn-lg btn-block mt-4">Realizar Venta</button>
            </div>
        </div>
    </div>
</div>`;

export async function Caja() {
    let d = document;
    let cP = d.getElementById('contenidoPrincipal');

    d.querySelector('.contenidoTitulo').innerHTML = 'Caja';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Caja";
    d.querySelector('.rutaMenu').setAttribute('href', "#/caja");

    cP.innerHTML = htmlCaja;

    let productosAgregados = [];
    let totalVenta = 0.00;

    const codigoProductoInput = d.getElementById("codigoProducto");
    const btnAgregarProducto = d.getElementById("btnAgregarProducto");
    const listaProductosDiv = d.getElementById("listaProductos");
    const totalVentaSpan = d.getElementById("totalVenta");
    const btnFinalizarVenta = d.getElementById("btnFinalizarVenta");

    async function agregarProducto() {
        const codigoBarra = codigoProductoInput.value.trim();
        if (codigoBarra === "") {
            Swal.fire('Error', 'Por favor ingrese un código de producto.', 'error');
            return;
        }

        const producto = await cajaServices.obtenerProductoPorCodigoBarras(codigoBarra);
        if (producto) {
            const productoExistente = productosAgregados.find(p => p.id === producto.id);
            if (productoExistente) {
                productoExistente.cantidad += 1;
                actualizarProductoVisual(productoExistente);
            } else {
                producto.cantidad = 1;
                productosAgregados.push(producto);
                agregarProductoVisual(producto);
            }

            totalVenta += parseFloat(producto.precio_final);
            totalVentaSpan.innerText = totalVenta.toFixed(2);

            codigoProductoInput.value = "";
        } else {
            Swal.fire('Error', 'Producto no encontrado.', 'error');
        }
    }

    function agregarProductoVisual(producto) {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto-item");
        productoDiv.setAttribute("data-id", producto.id);
        productoDiv.innerHTML = `
            <span>${producto.nombre} - $<span class="precio">${producto.precio_final.toFixed(2)}</span> x </span>
            <span class="cantidad">${producto.cantidad}</span>
            <button class="btn btn-secondary btn-sm ml-2 btnIncrementarCantidad" data-id="${producto.id}">+</button>
            <button class="btn btn-secondary btn-sm ml-1 btnDecrementarCantidad" data-id="${producto.id}">-</button>
            <button class="btn btn-danger btn-sm ml-3 btnQuitarProducto" data-id="${producto.id}">Quitar</button>
        `;
        listaProductosDiv.appendChild(productoDiv);
    }

    function actualizarProductoVisual(producto) {
        const productoDiv = listaProductosDiv.querySelector(`[data-id="${producto.id}"]`);
        if (productoDiv) {
            productoDiv.querySelector(".cantidad").innerText = producto.cantidad;
        }
    }

    function modificarCantidad(event) {
        debugger
        const id = parseInt(event.target.getAttribute("data-id"));
        const producto = productosAgregados.find(p => p.id === id);

        if (producto) {
            if (event.target.classList.contains("btnIncrementarCantidad")) {
                producto.cantidad += 1;
                totalVenta += producto.precio_final;
            } else if (event.target.classList.contains("btnDecrementarCantidad") && producto.cantidad > 1) {
                producto.cantidad -= 1;
                totalVenta -= producto.precio_final;
            }
            totalVentaSpan.innerText = totalVenta.toFixed(2);
            actualizarProductoVisual(producto);
        }
    }

    function quitarProducto(event) {
        if (event.target.classList.contains("btnQuitarProducto")) {
            const id = parseInt(event.target.getAttribute("data-id"));
            const productoIndex = productosAgregados.findIndex(p => p.id === id);
            if (productoIndex !== -1) {
                totalVenta -= productosAgregados[productoIndex].precio_final * productosAgregados[productoIndex].cantidad;
                totalVentaSpan.innerText = totalVenta.toFixed(2);

                productosAgregados.splice(productoIndex, 1);
                event.target.parentElement.remove();
            }
        }
    }

    // Escucha de eventos para los botones de la lista de productos
    listaProductosDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("btnIncrementarCantidad") || event.target.classList.contains("btnDecrementarCantidad")) {
            modificarCantidad(event);
        } else if (event.target.classList.contains("btnQuitarProducto")) {
            quitarProducto(event);
        }
    });

    async function finalizarVenta() {
        if (productosAgregados.length === 0) {
            Swal.fire('Error', 'No hay productos en la venta.', 'error');
            return;
        }

        const response = await cajaServices.realizarVenta(productosAgregados, totalVenta);
        if (response) {
            Swal.fire('Venta realizada', 'La venta se ha realizado exitosamente.', 'success');

            productosAgregados = [];
            totalVenta = 0.00;
            totalVentaSpan.innerText = totalVenta.toFixed(2);
            listaProductosDiv.innerHTML = "";
        } else {
            Swal.fire('Error', 'Hubo un problema al realizar la venta.', 'error');
        }
    }

    btnAgregarProducto.addEventListener("click", agregarProducto);
    listaProductosDiv.addEventListener("click", quitarProducto);
    listaProductosDiv.addEventListener("click", modificarCantidad);
    btnFinalizarVenta.addEventListener("click", finalizarVenta);
}
