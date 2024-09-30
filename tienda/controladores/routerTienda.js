import { Carrusel } from "./carrusel/carrusel.js";
import { listarPaquetes } from "./listarProductos/listarPaquetes.js";
import { vistaPaquete } from "./listarProductos/vistaPaquete.js";
import { ReservasActivas } from "./reservasactivas/reservasactivas.js";

import {
  getUsuarioAutenticado,
  login,
  mostrarUsuario,
  register,
  setUsuarioAutenticado,
} from "./login/login.js";

export function RouterTienda() {
  let session = getUsuarioAutenticado();
  setSession(session);
  let hash = location.hash;

  if (hash === "#login") {
    login();
  } else if (hash === "#register") {
    register();
  } else if (hash === "#logout") {
    setUsuarioAutenticado(false, -1);
    location.replace("tienda.html");
  } else if (hash === "") {
    Carrusel();
    listarPaquetes();
  } else if (hash === "#vistaPaquete") {
    vistaPaquete();
  } else if (hash === "#reservas") {
    ReservasActivas();
  }
  console.log(hash);
}

function setSession(session) {
  /**
   * Esta función se utiliza para recuperar los datos de sessión cada vez que se recarga la página.
   */
  let d = document;
  if (session.autenticado) {
    mostrarUsuario(session.email);
  }
}
