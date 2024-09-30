import { usuariosServices } from "/servicios/usuarios-servicios.js";


const htmlAmUsuarios = `
<div class="card card-dark card-outline">

	<form  class="needs-validation frmAmUsuario"  enctype="multipart/form-data">
	
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
					onchange="validateJS(event,'text')"
					name="nombre"
                    id="usuarioNombre"
					required>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>

				<!--=====================================
                Correo electrónico
                ======================================-->

				<div class="form-group mt-2">
					
					<label>Email</label>

					<input 
					type="email" 
					class="form-control"
					onchange="validateJS(event,'email')"
					name="email"
                    id="usuarioEmail"
					required>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>


				<!--=====================================
                Contraseña
                ======================================-->

				<div class="form-group mt-2">
					
					<label>Password</label>

					<input 
					type="password" 
					class="form-control"
					onchange="validateJS(event,'pass')"
					name="password"
                    id="usuarioPassword" 
					required
					>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>

                <!--=====================================
                Rol
                ======================================-->

				<div class="form-group mt-2">
					
					<label>Rol</label>

					<select 
                        class="form-control"
                        onchange="validateJS(event,'rol')"
                        name="rol"
                        id="usuarioRol"
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Cliente">Cliente</option>
                    </select>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>

			</div>
		

		</div>

		<div class="card-footer">
			
			<div class="col-md-8 offset-md-2">
	
				<div class="form-group mt-3">

					<a href="#/usuarios" class="btn btn-light border text-left">Cancelar</a>
					
					<button type="submit" class="btn bg-dark float-right">Guardar</button>

				</div>

			</div>

		</div>


	</form>


</div> `;
var formulario='';
var txtNombre='';
var txtEmail='';
var txtPass='';
var txtRol='';
var idUsuario;

export async function newRegister(){
    let d = document;
    
    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Usuario';
	d.querySelector('.contenidoTituloSec').innerHTML += 'Agregar';
   
    crearFormulario();

    formulario = d.querySelector(".frmAmUsuario")
    formulario.addEventListener("submit", guardar);
}

export async function editRegister(id){
    let d = document;
    idUsuario = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Usuario';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Editar';

    crearFormulario();

    formulario = d.querySelector(".frmAmUsuario")
    formulario.addEventListener("submit", modificar);

    let usuario =  await usuariosServices.listar(id);

    
    txtNombre.value= usuario.nombre;
    txtEmail.value= usuario.email;
    txtPass.value= usuario.password;
    txtRol.value= usuario.rol;
}

function crearFormulario(){
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Usuarios";
    d.querySelector('.rutaMenu').setAttribute('href',"#/usuarios");

    let cP =d.getElementById('contenidoPrincipal');
    cP.innerHTML =  htmlAmUsuarios;
    
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = '../controladores/validaciones.js';
    cP.appendChild(script);
    
    txtNombre= d.getElementById('usuarioNombre');
    txtEmail= d.getElementById('usuarioEmail');
    txtPass= d.getElementById('usuarioPassword');
    txtRol= d.getElementById('usuarioRol');
}

function guardar(e) {
    e.preventDefault();
  
    // Obtener los valores de los campos de nombre, email y contraseña
    var nombre = txtNombre.value;
    var email = txtEmail.value;
    var password = txtPass.value;
    var rol = txtRol.value;
  
    // Llamar al servicio para crear un usuario
    usuariosServices.crear(nombre, email, password, rol)
      .then(respuesta => {
        // Limpiar el formulario después de éxito
        formulario.reset();
        // Redirigir a la página de usuarios
        window.location.href = "#/usuarios";
        Swal.fire({
            icon: "success",
            text: respuesta.message,
          });
      })
      .catch(error => {
        // Manejar errores mostrando en la consola
        console.error("Error al crear usuario:", error.message);
        alert("Error al crear usuario: " + error.message);
      });
  }

  function modificar(e) {
    e.preventDefault();
  
    // Obtener los valores de los campos esenciales
    var nombre = txtNombre.value;
    var email = txtEmail.value;
    var password = txtPass.value;
    var rol = txtRol.value;
  
    // Llamar al servicio para editar el usuario
    usuariosServices.editar(idUsuario, nombre, email, password, rol)
      .then(respuesta => {
        // Limpiar el formulario después de éxito
        formulario.reset();
        // Redirigir a la página de usuarios
        window.location.href = "#/usuarios";
        Swal.fire({
            icon: "success",
            text: respuesta.message,
          });
      })
      .catch(error => {
        // Manejar errores mostrando en la consola
        console.error("Error al modificar usuario:", error.message);
        alert("Error al modificar usuario: " + error.message);
      });
  }
