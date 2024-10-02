import { categoriasServices } from "../../servicios/categoria-servicios.js";

const htmlAmCategoria = `
<div class="card card-dark card-outline">
    <form class="needs-validation frmAmCategoria">
        <div class="card-header">
            <div class="col-md-8 offset-md-2">
                <!-- Nombre -->
                <div class="form-group mt-2">
                    <label>Nombre</label>
                    <input type="text" class="form-control" name="nombre" id="categoriaNombre" required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter the category name.</div>
                </div>
                <!-- Descripción -->
                <div class="form-group mt-2">
                    <label>Descripción</label>
                    <textarea class="form-control" name="descripcion" id="categoriaDescripcion" rows="3" required></textarea>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please enter a description.</div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="col-md-8 offset-md-2">
                <div class="form-group mt-3">
                    <a href="#/categorias" class="btn btn-light border text-left">Cancelar</a>
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
var idCategoria;

export async function newRegister(){

    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Categoría';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Agregar';

    crearFormulario();

    formulario = d.querySelector('.frmAmCategoria');
    formulario.addEventListener('submit', guardar);
}

export async function editRegister(id) {
    let d = document;
    idCategoria = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Categoría';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Editar';

    await crearFormulario();  // Esto genera el formulario

    formulario = d.querySelector('.frmAmCategoria');
    formulario.addEventListener('submit', modificar);

    let categoria = await categoriasServices.listar(id);  // Obtenemos los datos de la categoría desde la API

    // Rellenar el formulario con los datos de la categoría
    txtNombre.value = categoria.nombre || '';  // Precargar el nombre
    txtDescripcion.value = categoria.descripcion || '';  // Precargar la descripción
}

async function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Categorías";
    d.querySelector('.rutaMenu').setAttribute('href', "#/categorias");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmCategoria;

    // Obtener los elementos del formulario
    txtNombre = d.getElementById('categoriaNombre');
    txtDescripcion = d.getElementById('categoriaDescripcion');
}

function guardar(e){
    e.preventDefault();

    var nombre = txtNombre.value;
    var descripcion = txtDescripcion.value;

    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);

    categoriasServices.crear(formData)
        .then(respuesta => {
            formulario.reset();
            window.location.hash = "#/categorias";
            swal.fire({
                icon: 'success',
                title: 'Categoría Creada',
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

    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);

    categoriasServices.editar(idCategoria, nombre, descripcion)
        .then(respuesta => {
            formulario.reset();
            window.location.hash = "#/categorias";
            swal.fire({
                icon: 'success',
                title: 'Categoría Modificada',
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
