import { ventasServices } from "../../servicios/ventas-servicios.js";

const htmlAmVentas = `
<div class="card card-dark card-outline">
    <form class="needs-validation frmAmVenta" enctype="multipart/form-data">
        <div class="card-header">
            <div class="col-md-8 offset-md-2">
                <!-- Producto -->
                <div class="form-group mt-5">
                    <label>Producto</label>
                    <input type="number" class="form-control" name="id_producto" id="ventaProducto" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Usuario -->
                <div class="form-group mt-2">
                    <label>Usuario</label>
                    <input type="number" class="form-control" name="id_usuario" id="ventaUsuario" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Cantidad de Producto -->
                <div class="form-group mt-2">
                    <label>Cantidad</label>
                    <input type="number" class="form-control" name="cantidad_producto" id="ventaCantidad" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Total -->
                <div class="form-group mt-2">
                    <label>Total</label>
                    <input type="number" class="form-control" name="total" id="ventaTotal" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!-- Tipo de Pago -->
                <div class="form-group mt-2">
                    <label>Tipo de Pago</label>
                    <select class="form-control" name="tipo_pago" id="ventaTipoPago" required>
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
                    <input type="date" class="form-control" name="fecha" id="ventaFecha" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="col-md-8 offset-md-2">
                <div class="form-group mt-3">
                    <a href="#/ventas" class="btn btn-light border text-left">Cancelar</a>
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

export async function newRegister() {
    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Venta';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Agregar';

    crearFormulario();

    formulario = d.querySelector(".frmAmVenta");
    formulario.addEventListener("submit", guardar);
}

export async function editRegister(id) {
    let d = document;
    idVenta = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Venta';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Editar';

    crearFormulario();

    formulario = d.querySelector(".frmAmVenta");
    formulario.addEventListener("submit", modificar);

    let venta = await ventasServices.listar(id);

    txtProducto.value = venta.id_producto;
    txtUsuario.value = venta.id_usuario;
    txtCantidad.value = venta.cantidad_producto;
    txtTotal.value = venta.total;
    txtTipoPago.value = venta.tipo_pago;
    txtFecha.value = venta.fecha;
}

function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Ventas";
    d.querySelector('.rutaMenu').setAttribute('href', "#/ventas");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmVentas;

    txtProducto = d.getElementById('ventaProducto');
    txtUsuario = d.getElementById('ventaUsuario');
    txtCantidad = d.getElementById('ventaCantidad');
    txtTotal = d.getElementById('ventaTotal');
    txtTipoPago = d.getElementById('ventaTipoPago');
    txtFecha = d.getElementById('ventaFecha');
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
    ventasServices.crear(id_producto, id_usuario, cantidad_producto, total, tipo_pago, fecha)
        .then(respuesta => {
            formulario.reset();
            window.location.href = "#/ventas";
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
    ventasServices.editar(idVenta, id_producto, id_usuario, cantidad_producto, total, tipo_pago, fecha)
        .then(respuesta => {
            formulario.reset();
            window.location.href = "#/ventas";
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
