import { paquetesServices } from "../../../servicios/paquetes-servicios.js";

function htmlPaquete(
  id,
  nombre,
  idDestino,
  precio,
  cupo,
  fechaInicio,
  fechaFin
) {
  /**1- ESTA FUNCION RECIBE COMO PARAMETRO los siguiente datos id, imagen, nombre y precio del producto */
  /**2- A ESTOS PARAMETROS LOS CONCATENA DENTRO DEL CODIGO CORRESPONDIENTE AL COMPONENTE itemProducto ( ASSETS/MODULOS/itemProducto.html)*/
  /**3- POR ULTIMO DEVUELVE LA CADENA RESULTANTE. */
  /**4- SE RECUERDA QUE PARA PODER HACER LA INTERPOLACION DE CADENAS ${NOMBRE_VARIABLE} EL TEXTO DEBE ESTAR ENTRE LAS COMILLAS ` `.
   *
   *  ejemplo
   *   let titulo = 'Señora';
   *   let cadena = `Hola, ${titulo} Claudia  en que podemos ayudarla`;
   *
   */
  const resultado = `
      <a href="?idPaquete=${id}#vistaPaquete" class="pro">
        
        <img src="./img/travelus-img/beach.jpg" alt="imagen"/>
          <div class="des">
            <span>${nombre} <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></span>
            <div class="star">
              
            </div>
            <h4>$${precio}</h4>
            <p class="cupo">Cupo: ${cupo}</p>
            <p class="fecha">del ${fechaInicio} al ${fechaFin}</p>

          </div>
        
      </a>

`;
  return resultado;
}

export async function listarPaquetes() {
  const seccionPaquetes = document.querySelector(".listarPaquetes");
  const paquetes = await paquetesServices.listar();
  let paquetesHTML = "";
  for (const paquete of paquetes) {
    if (paquete.cupo < 1) {
      
    } else {
      paquetesHTML += htmlPaquete(
        paquete.id,
        paquete.nombre,
        paquete.destino_id,
        paquete.precio,
        paquete.cupo,
        paquete.fecha_inicio,
        paquete.fecha_fin
      );
    }
  }
  seccionPaquetes.innerHTML = paquetesHTML;
}

/*1- ESTA FUNCION DEBERA CONSULTAR EN EL API-REST TODOS LOS PRODUCTOS PERTENECIENTES A LA CATEGORIA CON CODIGO ID  */
/*2- HACER UN BUCLE CON EL RESULTADO DE LA CONSULTA Y RECORRELO PRODUCTO POR PRODUCTO*/
/*3- EN EL INTERIOR DEL BUCLE DEBERA LLAMAR A LA FUNCION htmlItemProducto y acumular su resultado en una cadena de caracteres */
/*4- LUEGO DEL BUCLE Y CON LA CADENA RESULTANTE SE DEBE CAPTURAR EL ELEMENTO DEL DOM PARA ASIGNAR ESTOS PRODUCTOS DENTRO DE LA CATEGORIA CORRESPONDIENTE */
/*5- PARA ELLO PODEMOS HACER USO DE UN SELECTOR CSS QUE SELECCIONE EL ATRIBUTO data-idCategoria=X, Ó LA CLASE .productos  .SIENDO X EL VALOR LA CATEGORIA EN CUESTION.*/

//1
