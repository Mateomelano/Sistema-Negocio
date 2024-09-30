/*=============================================
Función para validar data repetida
=============================================*/
function validateRepeat(event, type){

  event.target.value = "";
  event.target.parentNode.classList.add('was-validated'); 
  event.target.parentNode.querySelector(".invalid-feedback").innerHTML = "Email repetido";


}


/*=============================================
Función para validar formulario
=============================================*/
function validateJS(event, type) {
  var pattern;
  var errorMessage = "Campo no válido";

  // Definir patrón y mensaje de error según el tipo de campo
  switch (type) {
    case "nombre":
      pattern = /^.{3,50}$/; // Entre 10 y 35 caracteres de cualquier tipo
      errorMessage = "El nombre debe tener entre 3 y 50 caracteres";
      break;
    case "descripcion":
      pattern = /^.{10,35}$/; // Entre 10 y 35 caracteres de cualquier tipo
      errorMessage = "La descripcion debe tener entre 10 y 35 caracteres";
      break;
      case "pais":
        pattern = /^.{2,50}$/; // Entre 10 y 35 caracteres de cualquier tipo
        errorMessage = "El nomobre debe tener entre 2 y 50 caracteres";
        break;
    case "text":
      pattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}$/;
      errorMessage = "Ingrese solo letras y espacios";
      break;
    case "email":
      pattern = /^[.a-zA-Z0-9_]+([.][.a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,}$/;
      errorMessage = "Ingrese un correo electrónico válido";
      break;
    case "pass":
      pattern = /^.{8,}$/; // Al menos 8 caracteres de cualquier tipo
      errorMessage = "La contraseña debe tener al menos 8 caracteres";
      break;
    case "rol":
      pattern = /^(Administrador|Cliente)$/;
      errorMessage = "Seleccione un rol válido (Administrador o Cliente)";
      break;
    case "number":
      pattern = /^[0-9]+$/;
      errorMessage = "Ingrese solo números";
      break;
    case "date":
      pattern = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
      errorMessage = "Fecha no válida";
      break;
    case "nombrePaquetes":
      pattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{10,35}$/;
      errorMessage = "El nombre debe tener entre 10 y 35 caracteres";
      break;
    default:
      // Si el tipo no coincide con ninguno de los anteriores, salir sin hacer nada
      return;
  }

  // Realizar la validación
  if (!pattern.test(event.target.value)) {
    event.target.value = ""; // Limpiar el valor del campo
    event.target.parentNode.classList.add('was-validated');
    event.target.parentNode.querySelector(".invalid-feedback").innerHTML = errorMessage;
  }
}
/*=============================================
Función para recordar credenciales de ingreso
=============================================*/

function rememberMe(event){
  
  if(event.target.checked){

    localStorage.setItem("emailRemember", $('[name="loginEmail"]').val());
    localStorage.setItem("checkRemember", true);

  }else{

    localStorage.removeItem("emailRemember");
    localStorage.removeItem("checkRemember");

  }

}

/*=============================================
Capturar el email para login desde el LocalStorage
=============================================*/

$(document).ready(function(){

  if(localStorage.getItem("emailRemember") != null){

     $('[name="loginEmail"]').val(localStorage.getItem("emailRemember"));
  }

  if(localStorage.getItem("checkRemember") != null && localStorage.getItem("checkRemember")){

    $('#remember').attr("checked",true);

  }

})
