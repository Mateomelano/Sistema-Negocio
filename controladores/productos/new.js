import { productosServices } from "../../servicios/producto-servicios.js";

const htmlAmProducto = `
<div class="card card-dark card-outline">

    <form class="needs-validation frmAmProducto" enctype="multipart/form-data">
    
        <div class="card-header">
               
            <div class="col-md-8 offset-md-2">	
               
                <!-- Otros campos como Nombre, Descripción, etc. -->

                <!--=====================================
                Categoría
                ======================================-->
                <div class="form-group mt-2">
                    <label>Categoría</label>
                    <select class="form-control" name="categoria" id="productoCategoria" required>
                        <option value="">Seleccionar categoría</option>
                        <option value="1">Categoría 1</option>
                        <option value="2">Categoría 2</option>
                        <!-- Añadir más categorías según sea necesario -->
                    </select>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please select a category.</div>
                </div>

                <!--=====================================
                Imagen
                ======================================-->
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

export async function editRegister(id){
    let d = document;
    idProducto = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Producto';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Editar';

    crearFormulario();

    formulario = d.querySelector('.frmAmProducto');
    formulario.addEventListener('submit', modificar);

    let producto = await productosServices.listar(id);

    txtNombre.value = producto.nombre;
    txtDescripcion.value = producto.descripcion;
    txtPrecioCoste.value = producto.precio_coste;
    txtPrecioFinal.value = producto.precio_final;
    txtCodBarra.value = producto.cod_barra;
    txtPeso.value = producto.peso;
}
function crearFormulario(){
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Productos";
    d.querySelector('.rutaMenu').setAttribute('href',"#/productos");

    let cP =d.getElementById('contenidoPrincipal');
    cP.innerHTML =  htmlAmProducto;

    var script = document.createElement( "script" );
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
