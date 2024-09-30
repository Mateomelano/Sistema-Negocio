import { destinosServices } from "../../servicios/destinos-servicios.js";

const htmlAmdestinos = `
<div class="card card-dark card-outline">

    <form  class="needs-validation frmAmDestino"  enctype="multipart/form-data">
    
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
                    pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}"
                    onchange="validateJS(event,'nombre')"
                    name="nombre"
                    id="destinoNombre"
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
                    id="destinoDescripcion"
                    required>

                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>

                <!--=====================================
                Pais
                ======================================-->

                <div class="form-group mt-2">
                    
                    <label>Pais</label>

                    <input 
                    type="text" 
                    class="form-control"
                    onchange="validateJS(event,'pais')"
                    name="pais"
                    id="destinoPais"
                    required>


                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>

                </div>
            </div>

        </div>
        <div class="card-footer">
			
			<div class="col-md-8 offset-md-2">
	
				<div class="form-group mt-3">

					<a href="#/destinos" class="btn btn-light border text-left">Cancelar</a>
					
					<button type="submit" class="btn bg-dark float-right">Guardar</button>

				</div>

			</div>

		</div>
    </form>
</div>
`;

var formulario ='';
var txtNombre = '';
var txtPais = '';
var txtDescripcion = '';
var idDestino;

export async function newRegister(){

    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Destino';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Agregar';

    crearFormulario();

    formulario = d.querySelector('.frmAmDestino');
    formulario.addEventListener('submit', guardar);
}

export async function editRegister(id){
    let d = document;
    idDestino = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Destino';
    d.querySelector('.contenidoTituloSec').innerHTML += ' Editar';

    crearFormulario();

    formulario = d.querySelector('.frmAmDestino');
    formulario.addEventListener('submit', modificar);

    let destino = await destinosServices.listar(id);

    txtNombre.value = destino.nombre;
    txtPais.value = destino.pais;
    txtDescripcion.value = destino.descripcion;
}

function crearFormulario(){
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Destinos";
    d.querySelector('.rutaMenu').setAttribute('href',"#/destinos");

    let cP =d.getElementById('contenidoPrincipal');
    cP.innerHTML =  htmlAmdestinos;

    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = "../controladores/validaciones.js";
    cP.appendChild(script);

    txtNombre = d.getElementById('destinoNombre');
    txtPais = d.getElementById('destinoPais');
    txtDescripcion = d.getElementById('destinoDescripcion'); 

}


function guardar(e){
    e.preventDefault();

    var nombre = txtNombre.value;
    var pais = txtPais.value;
    var descripcion = txtDescripcion.value;

    destinosServices.crear(nombre,descripcion,pais)
        .then(respuesta => {
            formulario.reset();
            window.location.hash = "#/destinos";
            swal.fire({
                icon: 'success',
                title: 'Destino Creado',
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
    var pais = txtPais.value;
    var descripcion = txtDescripcion.value; 

    destinosServices.editar(idDestino,nombre,descripcion,pais)
        .then(respuesta => {
            formulario.reset();
            window.location.hash = "#/destinos";
            swal.fire({
                icon: 'success',
                title: 'Destino Modificado',
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
