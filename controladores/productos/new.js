import { productosServices } from "../../servicios/producto-servicios.js";

const htmlAmProducto = `
<div class="card card-dark card-outline">
    <form class="needs-validation frmAmProducto" enctype="multipart/form-data">
        <div class="card-header">
            <div class="col-md-8 offset-md-2">
                <!-- Nombre -->
                <div class="form-group mt-2">
                    <label>Nombre</label>
                    <input type="text" class="form-control" name="nombre" id="productoNombre" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter the product name.</div>
                </div>
                <!-- Descripción -->
                <div class="form-group mt-2">
                    <label>Descripción</label>
                    <textarea class="form-control" name="descripcion" id="productoDescripcion" rows="3" required></textarea>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter a description.</div>
                </div>
                <!-- Precio Coste -->
                <div class="form-group mt-2">
                    <label>Precio Coste</label>
                    <input type="number" class="form-control" name="precio_coste" id="productoPrecioCoste" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter a cost price.</div>
                </div>
                <!-- Precio Final -->
                <div class="form-group mt-2">
                    <label>Precio Final</label>
                    <input type="number" class="form-control" name="precio_final" id="productoPrecioFinal" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter a final price.</div>
                </div>
                <!-- Código de Barra -->
                <div class="form-group mt-2">
                    <label>Código de Barra</label>
                    <input type="text" class="form-control" name="cod_barra" id="productoCodBarra" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter the barcode.</div>
                </div>
                <!-- Peso -->
                <div class="form-group mt-2">
                    <label>Peso</label>
                    <input type="number" class="form-control" name="peso" id="productoPeso" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter the weight.</div>
                </div>
                <!-- Categoría -->
                <div class="form-group mt-2">
                    <label>Categoría</label>
                    <select class="form-control" name="categoria" id="productoCategoria" required>
                        <option value="">Seleccionar categoría</option>
                    </select>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please select a category.</div>
                </div>
                <!-- Imagen -->
                <div class="form-group mt-2">
                    <label>Imagen del Producto</label>
                    <input type="file" class="form-control" name="imagen" id="productoImagen" accept="image/*">
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please upload an image.</div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="col-md-8 offset-md-2">
                <div class="form-group mt-3">
                    <a href="#/productos" class="btn btn-light border text-left">Cancelar</a>
                    <button type="submit" class="btn bg-dark float-right">Guardar</button>
                </div>
            </div>
        </div>
    </form>
</div>
`;


var formulario = '';
var txtNombre = '';
var txtDescripcion = '';
var txtPrecioCoste = '';
var txtPrecioFinal = '';
var txtCodBarra = '';
var txtPeso = '';
var idProducto;
var txtImagen = '';
var txtCategoria = '';

export async function newRegister(){

    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Producto';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Agregar';

    crearFormulario();

    formulario = d.querySelector('.frmAmProducto');
    formulario.addEventListener('submit', guardar);
}

export async function editRegister(id) {
    let d = document;
    idProducto = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Producto';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Editar';

    await crearFormulario();  // Esto genera el formulario

    formulario = d.querySelector('.frmAmProducto');
    formulario.addEventListener('submit', modificar);

    let producto = await productosServices.listar(id);  // Obtenemos los datos del producto desde la API

    // Rellenar el formulario con los datos del producto
    txtNombre.value = producto.nombre || '';  // Precargar el nombre
    txtDescripcion.value = producto.descripcion || '';  // Precargar la descripción
    txtPrecioCoste.value = producto.precio_coste || '';  // Precargar el precio de coste
    txtPrecioFinal.value = producto.precio_final || '';  // Precargar el precio final
    txtCodBarra.value = producto.cod_barra || '';  // Precargar el código de barra
    txtPeso.value = producto.peso || '';  // Precargar el peso

    // Seleccionar la categoría actual del producto
    let categoriaOption = Array.from(txtCategoria.options).find(option => option.value == producto.id_categoria);
    if (categoriaOption) {
        categoriaOption.selected = true;
    }
}


async function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Productos";
    d.querySelector('.rutaMenu').setAttribute('href', "#/productos");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmProducto;

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../controladores/validaciones.js";
    cP.appendChild(script);

    // Obtener los elementos del formulario
    txtNombre = d.getElementById('productoNombre');
    txtDescripcion = d.getElementById('productoDescripcion');
    txtPrecioCoste = d.getElementById('productoPrecioCoste');
    txtPrecioFinal = d.getElementById('productoPrecioFinal');
    txtCodBarra = d.getElementById('productoCodBarra');
    txtPeso = d.getElementById('productoPeso');
    txtImagen = d.getElementById('productoImagen');
    txtCategoria = d.getElementById('productoCategoria');

    // Obtener categorías de la API y agregarlas al select
    let categorias = await categoriasServices.listar();
    categorias.forEach(categoria => {
        let option = document.createElement('option');
        option.value = categoria.id;
        option.text = categoria.nombre;
        txtCategoria.appendChild(option);
    });
}



function guardar(e){
    e.preventDefault();

    var nombre = txtNombre.value;
    var descripcion = txtDescripcion.value;
    var precioCoste = txtPrecioCoste.value;
    var precioFinal = txtPrecioFinal.value;
    var codBarra = txtCodBarra.value;
    var peso = txtPeso.value;
    var categoria = txtCategoria.value;
    var imagen = txtImagen.files[0];

    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio_coste', precioCoste);
    formData.append('precio_final', precioFinal);
    formData.append('cod_barra', codBarra);
    formData.append('peso', peso);
    formData.append('categoria', categoria);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    productosServices.crear(formData)
        .then(respuesta => {
            formulario.reset();
            window.location.hash = "#/productos";
            swal.fire({
                icon: 'success',
                title: 'Producto Creado',
                text: respuesta.message,
            })
        })
        .catch(error => {
            console.log(error);
            swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            })
        });
}

function modificar(e){
    e.preventDefault();

    var nombre = txtNombre.value;
    var descripcion = txtDescripcion.value;
    var precioCoste = txtPrecioCoste.value;
    var precioFinal = txtPrecioFinal.value;
    var codBarra = txtCodBarra.value;
    var peso = txtPeso.value;
    var categoria = txtCategoria.value;
    var imagen = txtImagen.files[0];

    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio_coste', precioCoste);
    formData.append('precio_final', precioFinal);
    formData.append('cod_barra', codBarra);
    formData.append('peso', peso);
    formData.append('categoria', categoria);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    productosServices.editar(idProducto, formData)
        .then(respuesta => {
            formulario.reset();
            window.location.hash = "#/productos";
            swal.fire({
                icon: 'success',
                title: 'Producto Modificado',
                text: respuesta.message,
            })
        })
        .catch(error => {
            console.log(error);
            swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            })
        });
}
