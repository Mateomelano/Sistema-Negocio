import { paquetesServices } from "../../../servicios/paquetes-servicios.js";
import { reservaServices } from "../../../servicios/reservas-servicios.js";
import { getUsuarioAutenticado } from "../login/login.js";

export async function vistaPaquete() {
  const carrusel = document.querySelector(".carrusel");
  const seccionPaquetes = document.querySelector(".seccionPaquetes");
  const seccionLogin = document.querySelector(".seccionLogin");
  const buscador = document.querySelector(".buscador");
  const reservas = document.querySelector(".seccionReservas");
  buscador.style.display = "none";

  seccionLogin.innerHTML = "";
  carrusel.innerHTML = "";
  reservas.innerHTML = "";

  const vistaPaquetes = document.querySelector(".vistaPaquetes");
  const idPaquete = leerParametro();

  if (idPaquete) {
    const paquete = await paquetesServices.listar(idPaquete);
    const htmlPaquete = htmlVistaPaquete(
      paquete.id,
      paquete.nombre,
      paquete.precio,
      paquete.destino_id,
      paquete.cupo,
      paquete.fecha_inicio,
      paquete.fecha_fin
    );
    vistaPaquetes.innerHTML = htmlPaquete;

    const cantidadPersonasInput = document.getElementById("cantidadPersonas");
    const precioPaquete = document.getElementById("precioPaquete");
    const precioOriginal = paquete.precio;

    cantidadPersonasInput.addEventListener("input", () => {
      const cantidad = parseInt(cantidadPersonasInput.value);
      precioPaquete.textContent = `$${(precioOriginal * cantidad).toFixed(2)}`;
    });

    document.getElementById("btnComprar").addEventListener('click', registrarCompra);
  }
}

function htmlVistaPaquete(id, nombre, precio, destino_id, cupo, fecha_inicio, fecha_fin) {
  const resultado = `
  <div class="contenedor-paquete">
    <div class="imagen">
      <img src="./img/travelus-img/beach.jpg" alt="producto">
    </div>
    <div class="texto">
      <p class="tag">NUEVO</p>
      <p id="namePaquete" data-idPaquete=${id}>${nombre}</p>

      <p id="IdPaquete" data-idPaquete=${id}></p>

      <p id="precioPaquete">$${precio.toFixed(2)}</p>

      <p class="cupo">Cupo: ${cupo}</p>

      <p class="fecha">fechas: <br>del ${fecha_inicio} al ${fecha_fin}</p>

      <div class="form-group">
        <label for="cantidadPersonas">Cantidad</label>
        <input type="number" step="1" min="1" value="1" id="cantidadPersonas">
      </div>

      <a id="btnComprar">Comprar</a>
    </div>
  </div>
  `;
  return resultado;
}

function leerParametro() {
  const words = new URLSearchParams(window.location.search);
  let cad = words.get("idPaquete");
  if (!cad) return null;
  return cad.trim();
}

async function registrarCompra() {
  const session = getUsuarioAutenticado();

  if (!session.autenticado) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Para ver las reservas debe iniciar sesión"
    });
  } else {
    const idUsuario = session.idUsuario;
    const idPaquete = document.getElementById('IdPaquete').getAttribute('data-idPaquete');
    const cantidad_personas = document.getElementById("cantidadPersonas").value;
    const fecha = new Date().toISOString().split('T')[0];

    try {
      const res = await reservaServices.crear(idUsuario, idPaquete, fecha, cantidad_personas);
      if (res.ok == 'true') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.message
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Listo!",
          text: "Compra finalizada"
        }).then(() => {
          location.replace("tienda.html");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al registrar la compra"
      });
    }
  }
}
