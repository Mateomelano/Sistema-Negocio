/**ESTE MODULO SE ENCARGA DE RENDERIZAR LA PANTALLA DE LOGIN Y DE REGISTRO SEGUN CORRESPONDA */
import { usuariosServices } from "../../../servicios/usuarios-servicios.js";

/** 1- Se debe asignar a la siguiente constante todo el código correspondiente al componente de login (/asset/modulos/login.html)  */
const htmlLogin = `
<div class="contenedorLogin">
    <div class="cajaLogin">
        <p id="iniciar-sesion">Iniciar Sesion / Registrarse</p>

        <form class="formLogin">

            <div class="input-group">
                <input type="text" class="form-control" id="loginNombre" placeholder="Nombre" name="Nombre" autocomplete required>
            </div>

            <div class="input-group">
                <input type="email" class="form-control" id="loginEmail" placeholder="Email" name="loginEmail" autocomplete required>
            </div>

            <div class="input-group">
                <input type="password" class="form-control" id="loginPassword" placeholder="Password" name="loginPassword" autocomplete required>
            </div>

            <div class="input-group">
                <input type="password" class="form-control" id="reLoginPassword" placeholder="Repetir Password" name="reLoginPassword" required>
            </div>

            <div class="row">
                <div class="col-4">
                    <button type="submit" id="iniciar-sesion" class="btnAmarillo">Login</button>
                </div>
            </div>
        </form>
    </div>
</div>`;

/* 2- Se deben definir 4 variables globales al módulo, una para el formulario html, y otras tres para los inputs de email, contraseña y repetir contraseña */
var formulario;
var inputNombre;
var inputEmail;
var inputPassword;
var inputRepetirPass;

export async function login() {
    /** 3- Esta función se encarga de llamar a la función crearFormulario y de enlazar el evento submit del formulario de login */
    crearFormulario(false);
    formulario.addEventListener("submit", ingresar);
}

export async function register() {
    /** 4- Esta función se encarga de llamar a la función crearFormulario y de enlazar el evento submit del formulario de registro.
     *     Esta función es similar a la de login, pero en el llamado a la función crearFormulario lo hace pasando el valor true al
     *     al parámetro registro que espera función mencionada.
     *     Por último enlaza el evento submit del formulario a la función registrarUsuario.
     */
    crearFormulario(true);
    formulario.addEventListener("submit", registrarUsuario);
}

function crearFormulario(registrar) {
    /**
     * 1- Esta función deberá capturar el elemento cuya clase es .carrusel y le asignará en su interior un blanco para eliminar su contenido previo.
     * 2- Deberá realizar lo mismo para la clase .seccionProductos y .vistaProducto.
     * 3- Luego deberá capturar la .seccionLogin para asignarle el contenido html del componente login, el cual se encuentra previamente
     *    cargado en la constante htmlLogin.
     * 4- Deberá capturar los id correspondientes a loginEmail, loginPassword y reLoginPassword para asignarlos a las variable definidas
     *    inputEmail, inputPassword e inputRepetirPass.
     * 5- En el caso que el parámetro registrar sea falso deberá eliminar el contenido del elemento id reLoginPassword.
     * 6- Para el caso que el parámetro registrar sea verdadero deberá cambiar el valor de la propiedad css dysplay a block. De esta forma
     *    el input reLoginPassword se mostrará en pantalla.
     * 7- Por último se deberá capturar el formulario indentificado con la clase .formLogin y asignarlo a la variable global formulario.
     */
    /* 1 */
    var seccionCarrusel = document.querySelector(".carrusel");
    seccionCarrusel.innerHTML = "";
    /* 2 */
    var listarPaquetes = document.querySelector(".listarPaquetes");
    var vistaPaquetes = document.querySelector(".vistaPaquetes");
    listarPaquetes.innerHTML = "";
    vistaPaquetes.innerHTML = "";
    
    var buscador = document.querySelector(".buscador");
    buscador.style.display = "none";
    /* 3 */
    var seccionLogin = document.querySelector(".seccionLogin");
    seccionLogin.innerHTML = htmlLogin;
    /* 4 */
    inputNombre = document.getElementById("loginNombre");
    inputEmail = document.getElementById("loginEmail");
    inputPassword = document.getElementById("loginPassword");
    inputRepetirPass = document.getElementById("reLoginPassword");
    /* 5 */
    if (!registrar) {
        inputRepetirPass.outerHTML = "";
        inputNombre.outerHTML = "";
    } else {
        inputRepetirPass.style.display = "block";
        inputNombre.style.display = "block";
    }
    /* 7 */
    formulario = document.querySelector(".formLogin");
}

async function ingresar(e) {
    e.preventDefault(); // Cancela el comportamiento por defecto del evento
  
    try {
      const idUsuario = await usuarioExiste();
  
      if (idUsuario) {
        setUsuarioAutenticado(true, idUsuario);
        mostrarUsuario(inputNombre.value);
        window.location.href = "#"; // Redirige a la página principal o a la que corresponda después del login
      } else {
        mostrarMensaje('Email o contraseña incorrecto, intenta nuevamente');
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      mostrarMensaje('Ocurrió un error al intentar ingresar. Intenta nuevamente más tarde.');
    }
  }
  

  async function registrarUsuario(e) {
    e.preventDefault(); // Cancela el comportamiento por defecto del evento
  
    // Obtener valores de los campos
    const nombre = inputNombre.value.trim(); // Asumiendo que el nombre no es obligatorio en el registro
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    const repetirPassword = inputRepetirPass.value.trim();
  
    // Validación: Contraseñas coinciden y tienen al menos 8 caracteres
    if (password !== repetirPassword) {
      mostrarMensaje("Las contraseñas ingresadas no son iguales.");
      return;
    }
  
    if (password.length < 8) {
      mostrarMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
  
    // Validación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje("El correo electrónico ingresado no tiene un formato válido.");
      return;
    }
  
    try {
      // Obtener la lista de usuarios
      const usuarios = await usuariosServices.listar();
  
      // Verificar si ya existe un usuario con el mismo email
      const usuarioExistente = usuarios.find(usuario => usuario.email === email);
      if (usuarioExistente) {
        mostrarMensaje("Ya existe un usuario registrado con este correo electrónico.");
        return;
      }
  
      // Llamar al servicio para crear un nuevo usuario
      await usuariosServices.crear(nombre, email, password);
  
      // Mostrar mensaje de éxito y redirigir a la pantalla de login
      mostrarMensaje("Email Registrado. Por favor, inicia sesión.");
      window.location.href = "#login";
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      mostrarMensaje(error.message);
    }
  }

async function usuarioExiste() {
    /**
     * 1- El objetivo de esta función es consultar la lista de usuarios con la función usuariosServices.listar() y mediante
     *    un bucle comparar el email y la contraseña ingresado por el usuario en inputEmail e inputPassword con los previamente
     *    almacenados dentro del API-REST sobre el recuros usuarios.
     * 2- Si el email y la contraseña son válidos devuelve el id de usuario.
     * 3- Si el email y la contraseña no son válido devuelve falso.
     */

    /* 1 */
    let existeUsuario = false;
    let idUsuario;

    try {
        const usuarios = await usuariosServices.listar();

        usuarios.forEach(usuario => {
            console.log(usuario);
            if (usuario.email === inputEmail.value && usuario.password === inputPassword.value) {
                idUsuario = usuario.id;
                existeUsuario = true;
            }
        });

    } catch (error) {
        console.error(error);
    }
    if (!existeUsuario) {
      mostrarMensaje('El usuario no existe');
      return false;
  }

  return idUsuario;
}

export function mostrarUsuario(email) {
  /**
   * 1- Esta función deberá capturar del dom la clase .btnLogin y asignarle el texto existente en el parámetro email.
   * 2- Deberá capturar del dom la clase .btnRegister y asignarle el texto "Logout" y a este elemento asignarle el valor
   *    "#logout" sobre el atributo href.
   **/

  /* 1 */
  var btnlogin = document.querySelector(".btnLogin");
  /* 2 */
  var btnRegister = document.querySelector(".btnRegister");
  btnlogin.textContent = email;
  btnRegister.textContent = "Cerrar Sesion";
  btnRegister.href = "#logout";
}

function mostrarMensaje(msj) {
  /**
   * Esta función muestra una alerta con el texto recibido en el parámetro msj.
   */
  Swal.fire({
    text: msj,
  });
}

export function setUsuarioAutenticado(booleano, idUsuario) {
  /**
   * 1- Esta función deberá registar en el sessionStorage tres valores: autenticado, idUsuario y email.
   * 2- Los valores de los mismos serán tomados de los dos parámetros recibidos y el email será tomado desde la variable
   *    inputEmail.
   */
  /* 1-2 */
  let email = inputEmail ? inputEmail.value : "";
  sessionStorage.setItem('autenticado', booleano);
  sessionStorage.setItem('idUsuario', idUsuario);
  sessionStorage.setItem('email', email);
}

export function getUsuarioAutenticado() {
  /**
   * 1- Esta función debera leer los valores almacenados en el sessionStorage y construir un objeto con los valores
   * autenticado, idUsuario y email.
   * 2- Luego los devolverá como resultado.
   */

  // 1
  var session = {};
  session.autenticado = sessionStorage.getItem("autenticado") === "true";
  session.idUsuario = sessionStorage.getItem("idUsuario");
  session.email = sessionStorage.getItem("email");
  // 2
  return session;
}

