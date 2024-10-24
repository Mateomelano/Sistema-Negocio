import { cajaServices } from "../../servicios/caja-servicios.js";

const htmlAmCaja = `
<div class="card card-dark card-outline">
    <form class="needs-validation frmAmCaja" enctype="multipart/form-data">
        <div class="card-header">
            <div class="col-md-8 offset-md-2">
                <!-- Producto -->
                <div class="form-group mt-5">
                    <label>Producto (Código de barras o nombre)</label>
                    <input type="text" class="form-control" name="producto" id="cajaProducto" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Usuario -->
                <div class="form-group mt-2">
                    <label>Usuario</label>
                    <input type="number" class="form-control" name="id_usuario" id="cajaUsuario" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Cantidad de Producto -->
                <div class="form-group mt-2">
                    <label>Cantidad</label>
                    <input type="number" class="form-control" name="cantidad_producto" id="cajaCantidad" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Total (Calculado automáticamente) -->
                <div class="form-group mt-2">
                    <label>Total</label>
                    <input type="number" class="form-control" name="total" id="cajaTotal" readonly>
                </div>

                <!-- Tipo de Pago -->
                <div class="form-group mt-2">
                    <label>Tipo de Pago</label>
                    <select class="form-control" name="tipo_pago" id="cajaTipoPago" required>
                        <option value="">Seleccione un tipo de pago</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                    </select>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Fecha -->
                <div class="form-group mt-2">
                    <label>Fecha</label>
                    <input type="date" class="form-control" name="fecha" id="cajaFecha" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="col-md-8 offset-md-2">
                <div class="form-group mt-3">
                    <a href="#/caja" class="btn btn-light border text-left">Cancelar</a>
                    <button type="submit" class="btn bg-dark float-right">Guardar</button>
                </div>
            </div>
        </div>
    </form>
</div>`;

var formulario = '';
var txtProducto = '';
var txtUsuario = '';
var txtCantidad = '';
var txtTotal = '';
var txtTipoPago = '';
var txtFecha = '';
var idVenta;

export async function newTransaction() {
    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Caja - Nueva Venta';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Agregar';

    crearFormulario();

    formulario = d.querySelector(".frmAmCaja");
    formulario.addEventListener("submit", guardar);
}

export async function editTransaction(id) {
    let d = document;
    idVenta = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Caja - Editar Venta';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Editar';

    crearFormulario();

    formulario = d.querySelector(".frmAmCaja");
    formulario.addEventListener("submit", modificar);

    let venta = await cajaServices.listar(id);

    txtProducto.value = venta.id_producto;
    txtUsuario.value = venta.id_usuario;
    txtCantidad.value = venta.cantidad_producto;
    txtTotal.value = venta.total;
    txtTipoPago.value = venta.tipo_pago;
    txtFecha.value = venta.fecha;
}

function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Caja";
    d.querySelector('.rutaMenu').setAttribute('href', "#/caja");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmCaja;

    txtProducto = d.getElementById('cajaProducto');
    txtUsuario = d.getElementById('cajaUsuario');
    txtCantidad = d.getElementById('cajaCantidad');
    txtTotal = d.getElementById('cajaTotal');
    txtTipoPago = d.getElementById('cajaTipoPago');
    txtFecha = d.getElementById('cajaFecha');

    // Evento para calcular el total automáticamente cuando se cambia la cantidad o se selecciona el producto
    txtProducto.addEventListener('change', calcularTotal);
    txtCantidad.addEventListener('input', calcularTotal);
}

async function calcularTotal() {
    let productoCodigo = txtProducto.value;
    let cantidad = txtCantidad.value;

    if (productoCodigo && cantidad > 0) {
        try {
            let producto = await cajaServices.obtenerProductoPorCodigo(productoCodigo);
            let total = producto.precio * cantidad;
            txtTotal.value = total.toFixed(2);
        } catch (error) {
            console.error('Error al obtener producto:', error.message);
            txtTotal.value = '0.00';
        }
    } else {
        txtTotal.value = '0.00';
    }
}

function guardar(e) {
    e.preventDefault();

    // Obtener los valores de los campos de venta
    var id_producto = txtProducto.value;
    var id_usuario = txtUsuario.value;
    var cantidad_producto = txtCantidad.value;
    var total = txtTotal.value;
    var tipo_pago = txtTipoPago.value;
    var fecha = txtFecha.value;

    // Llamar al servicio para crear una venta
    cajaServices.crear(id_producto, id_usuario, cantidad_producto, total, tipo_pago, fecha)
        .then(respuesta => {
            formulario.reset();
            window.location.href = "#/caja";
            Swal.fire({
                icon: "success",
                text: respuesta.message,
            });
        })
        .catch(error => {
            console.error("Error al crear venta:", error.message);
            alert("Error al crear venta: " + error.message);
        });
}

function modificar(e) {
    e.preventDefault();

    var id_producto = txtProducto.value;
    var id_usuario = txtUsuario.value;
    var cantidad_producto = txtCantidad.value;
    var total = txtTotal.value;
    var tipo_pago = txtTipoPago.value;
    var fecha = txtFecha.value;

    // Llamar al servicio para editar la venta
    cajaServices.editar(idVenta, id_producto, id_usuario, cantidad_producto, total, tipo_pago, fecha)
        .then(respuesta => {
            formulario.reset();
            window.location.href = "#/caja";
            Swal.fire({
                icon: "success",
                text: respuesta.message,
            });
        })
        .catch(error => {
            console.error("Error al modificar venta:", error.message);
            alert("Error al modificar venta: " + error.message);
        });
}
