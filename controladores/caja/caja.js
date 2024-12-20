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
            // Buscar si el producto ya está en la lista de productos agregados usando el ID
            const productoExistente = productosAgregados.find(p => p.id_producto === producto.id_producto);
            
            if (productoExistente) {
                // Incrementar la cantidad y actualizar visualmente
                productoExistente.cantidad += 1;
                actualizarProductoVisual(productoExistente);
            } else {
                // Si el producto no existe, agregarlo a la lista y mostrarlo visualmente
                producto.cantidad = 1;
                productosAgregados.push(producto);
                agregarProductoVisual(producto);
            }
    
            // Actualizar el total de la venta
            totalVenta += parseFloat(producto.precio_final);
            totalVentaSpan.innerText = totalVenta.toFixed(2);
    
            // Limpiar el input
            codigoProductoInput.value = "";
        } else {
            Swal.fire('Error', 'Producto no encontrado.', 'error');
        }
    }
    
    function agregarProductoVisual(producto) {
        
        // Verificar si el producto ya tiene un elemento visual en el DOM
        let productoDiv = listaProductosDiv.querySelector(`[data-id="${producto.id_producto}"]`);
        
        if (!productoDiv) {
            // Si el producto no existe en el DOM, crear un nuevo elemento visual
            productoDiv = document.createElement("div");
            productoDiv.classList.add("producto-item");
            productoDiv.setAttribute("data-id", producto.id_producto);
            
            // Crear el contenido visual del producto
            productoDiv.innerHTML = `
                <span>${producto.nombre} - $<span class="precio">${producto.precio_final.toFixed(2)}</span> x </span>
                <span class="cantidad">${producto.cantidad}</span>
                <button class="btn btn-secondary btn-sm ml-2 btnIncrementarCantidad" data-id="${producto.id_producto}">+</button>
                <button class="btn btn-secondary btn-sm ml-1 btnDecrementarCantidad" data-id="${producto.id_producto}">-</button>
                <button class="btn btn-danger btn-sm ml-3 btnQuitarProducto" data-id="${producto.id_producto}">Quitar</button>
            `;
    
            // Agregar el nuevo elemento al contenedor de productos
            listaProductosDiv.appendChild(productoDiv);
        } else {
            // Si el producto ya existe, actualizar la cantidad visualmente
            productoDiv.querySelector(".cantidad").innerText = producto.cantidad;
        }
    }
    
    function actualizarProductoVisual(producto) {
        
        const productoDiv = listaProductosDiv.querySelector(`[data-id="${producto.id_producto}"]`);
        if (productoDiv) {
            // Actualizar la cantidad visualmente
            productoDiv.querySelector(".cantidad").innerText = producto.cantidad;
        }
    }
    
    function modificarCantidad(event) {
        
        const id = parseInt(event.target.getAttribute("data-id"));
        const producto = productosAgregados.find(p => p.id_producto === id);
    
        if (producto) {
            if (event.target.classList.contains("btnIncrementarCantidad")) {
                producto.cantidad += 1;
                totalVenta += producto.precio_final;
            } else if (event.target.classList.contains("btnDecrementarCantidad") && producto.cantidad > 1) {
                producto.cantidad -= 1;
                totalVenta -= producto.precio_final;
            } else if (event.target.classList.contains("btnDecrementarCantidad") && producto.cantidad === 1) {
                Swal.fire('Info', 'No puedes reducir la cantidad por debajo de 1.', 'info');
                return;
            }
    
            totalVentaSpan.innerText = totalVenta.toFixed(2);
            actualizarProductoVisual(producto);
        }
    }
    

    function quitarProducto(event) {
        if (event.target.classList.contains("btnQuitarProducto")) {
            const id = parseInt(event.target.getAttribute("data-id"));
            const productoIndex = productosAgregados.findIndex(p => p.id_producto === id);
            if (productoIndex !== -1) {
                totalVenta -= productosAgregados[productoIndex].precio_final * productosAgregados[productoIndex].cantidad;
                totalVentaSpan.innerText = totalVenta.toFixed(2);

                productosAgregados.splice(productoIndex, 1);
                event.target.parentElement.remove();
            }
        }
    }

// Agregar la escucha de eventos al contenedor de productos (esto debe ejecutarse solo una vez)



async function finalizarVenta() {

    const usuarioId = sessionStorage.getItem('usuarioId'); // Obtener el ID del usuario de sessionStorage

    if (!usuarioId) {
        Swal.fire('Error', 'No se pudo obtener el ID del usuario. Intente iniciar sesión nuevamente.', 'error');
        return;
    }
    if (productosAgregados.length === 0) {
        Swal.fire('Error', 'No hay productos en la venta.', 'error');
        return;
    }

    // Mapear productos al esquema requerido para enviar
    const productosParaVenta = productosAgregados.map(producto => ({
        id: producto.id_producto,                   // ID del producto
        cantidad: producto.cantidad,       // Cantidad del producto
        subtotal: producto.precio_final * producto.cantidad,  // Calcular subtotal
        idCategoria: producto.id_categoria  // ID de la categoría
    }));
    debugger
    const response = await cajaServices.realizarVenta(usuarioId, productosParaVenta, totalVenta);
    console.log(response)
    if (response) {
        Swal.fire('Venta realizada', 'La venta se ha realizado exitosamente.', 'success');

        // Resetear la lista de productos y el total de venta
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
