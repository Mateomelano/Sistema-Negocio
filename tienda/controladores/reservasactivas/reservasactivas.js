import { reservaServices } from "../../../servicios/reservas-servicios.js";
import { getUsuarioAutenticado } from "../login/login.js";
import { paquetesServices } from "../../../servicios/paquetes-servicios.js";

function htmlReserva(
    id,
    usuario_id,
    paquete_id,
    fecha_reserva,
    cantidad_personas
){
    const resultado = `
    <div class="container">
        <a class="pro">
            <img src="./img/travelus-img/beach.jpg" alt="imagen" class="pro-img" />
            <div class="des">
              <h4 class="package title">${paquete_id}</h4>
              <div class="info">
                <p class="fecha cupo">Fecha de Reserva: ${fecha_reserva}</p>
                <p class="cant_pers cupo">Cantidad de Personas: ${cantidad_personas}</p>
              </div>
              <button class="eliminarBtn" data-idReserva="${id}">Cancelar reserva <i class="fa-regular fa-trash-can"></i></button>
            </div>
        </a>
    </div>
    `;
    return resultado;
}

export async function ReservasActivas() {
    const session = getUsuarioAutenticado();
    if (!session.autenticado) {
        Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "Para ver las reservas debe iniciar sesión"
        }).then(() => {
            location.replace("tienda.html");
        });
    } else {
        const carrusel = document.querySelector(".carrusel");
        const listarPaquetes = document.querySelector(".listarPaquetes");
        const seccionLogin = document.querySelector(".seccionLogin");
        const reservas = document.querySelector(".seccionReservas");

        seccionLogin.innerHTML = "";
        carrusel.innerHTML = "";
        reservas.innerHTML = "";
        listarPaquetes.innerHTML = "";

        const reservasActivas = await reservaServices.listarPorUsuario(session.idUsuario)
        let reservasHTML = "";
        for (const reserva of reservasActivas) {
            const nombre = await paquetesServices.listar(reserva.paquete_id);
            reservasHTML += htmlReserva(
                reserva.id,
                reserva.usuario_id,
                `${nombre.nombre}`,
                reserva.fecha_reserva,
                reserva.cantidad_personas
            );
        }
        reservas.innerHTML = reservasHTML;

        // Añadir eventos de clic a los botones de eliminar
        const botonesEliminar = document.querySelectorAll(".eliminarBtn");
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", borrar);
        });
    }
}

async function borrar(event) {
    let id = this.getAttribute('data-idReserva');
    let borrar = 0;
    await Swal.fire({
        title: '¿Está seguro que desea eliminar la Reserva?',
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: `Cancelar`,
        focusDeny: true
    }).then((result) => {
        if (result.isConfirmed) {
            borrar = 1;
        } else if (result.isDenied) {
            borrar = 0;
            Swal.fire('Se canceló la eliminación', '', 'info');
        }
    });

    if (borrar === 1) {
        try {
            // Obtener la reserva a eliminar
            let reserva = await reservaServices.listar(id);
            let paquete_id = reserva.paquete_id;
            let cantidad_personas = reserva.cantidad_personas;

            // Eliminar la reserva
            const borrado = await reservaServices.borrar(id);

            // Obtener información del paquete
            let paquete = await paquetesServices.listar(paquete_id);

            if (paquete) {
                // Actualizar el cupo del paquete
                let nuevoCupo = paquete.cupo + cantidad_personas;
                await paquetesServices.editar(paquete.id, paquete.destino_id, paquete.nombre, paquete.precio, nuevoCupo, paquete.fecha_inicio, paquete.fecha_fin);

                Swal.fire({
                    icon: 'success',
                    title: 'Reserva Eliminada',
                    text: 'La reserva se ha eliminado',
                    showConfirmButton: true,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo encontrar el paquete para actualizar el cupo.',
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    }
    await ReservasActivas();
}
