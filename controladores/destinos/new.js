import { productosServices } from "../../servicios/producto-servicios.js";

const htmlAmProducto = `
<div class="card card-dark card-outline">

    <form class="needs-validation frmAmProducto" enctype="multipart/form-data">
    
        <div class="card-header">
               
            <div class="col-md-8 offset-md-2">	
               
                <!--=====================================
                Nombre
                ======================================-->
                
                <div class="form-group mt-5">
                    
                    <label>Nombre</label>

                    <input 
                    type="text" 
                    class="form-control"
                    pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}"
                    onchange="validateJS(event,'nombre')"
                    name="nombre"
                    id="productoNombre"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>

                <!--=====================================
                Descripción
                ======================================-->   

                <div class="form-group mt-2">
                    
                    <label>Descripción</label>

                    <input 
                    type="text" 
                    class="form-control"
                    onchange="validateJS(event,'descripcion')"
                    name="descripcion"
                    id="productoDescripcion"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>

                <!--=====================================
                Precio de Coste
                ======================================-->

                <div class="form-group mt-2">
                    
                    <label>Precio de Coste</label>

                    <input 
                    type="number" 
                    class="form-control"
                    onchange="validateJS(event,'precio_coste')"
                    name="precio_coste"
                    id="productoPrecioCoste"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>

                <!--=====================================
                Precio Final
                ======================================-->

                <div class="form-group mt-2">
                    
                    <label>Precio Final</label>

                    <input 
                    type="number" 
                    class="form-control"
                    onchange="validateJS(event,'precio_final')"
                    name="precio_final"
                    id="productoPrecioFinal"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>

                <!--=====================================
                Código de Barra
                ======================================-->

                <div class="form-group mt-2">
                    
                    <label>Código de Barra</label>

                    <input 
                    type="text" 
                    class="form-control"
                    onchange="validateJS(event,'cod_barra')"
                    name="cod_barra"
                    id="productoCodBarra"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>

                <!--=====================================
                Peso
                ======================================-->

                <div class="form-group mt-2">
                    
                    <label>Peso</label>

                    <input 
                    type="number" 
                    class="form-control"
                    onchange="validateJS(event,'peso')"
                    name="peso"
                    id="productoPeso"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

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

    txtNombre = d.getElementById('productoNombre');
    txtDescripcion = d.getElementById('productoDescripcion');
    txtPrecioCoste = d.getElementById('productoPrecioCoste');
    txtPrecioFinal = d.getElementById('productoPrecioFinal');
    txtCodBarra = d.getElementById('productoCodBarra');
    txtPeso = d.getElementById('productoPeso');
}

function guardar(e){
    e.preventDefault();

    var nombre = txtNombre.value;
    var descripcion = txtDescripcion.value;
    var precioCoste = txtPrecioCoste.value;
    var precioFinal = txtPrecioFinal.value;
    var codBarra = txtCodBarra.value;
    var peso = txtPeso.value;

    productosServices.crear(nombre, descripcion, precioCoste, precioFinal, codBarra, peso)
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

    productosServices.editar(idProducto, nombre, descripcion, precioCoste, precioFinal, codBarra, peso)
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
