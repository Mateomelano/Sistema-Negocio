const url = "http://127.0.0.1:8000/reserva";
import { paquetesServices } from "./paquetes-servicios.js";

async function listar(id) {
    let cadUrl;
    if (isNaN(id)) 
      cadUrl = url;
    else
      cadUrl = `${url}/${id}`;
  
    const response = await fetch(cadUrl);
    return response.json();
}

async function crear(usuario_id, paquete_id, fecha_reserva, cantidad_personas) { 
    let paquete = await paquetesServices.listar(paquete_id);
    if (parseInt(paquete.cupo) < cantidad_personas) {
        return {
            ok: 'true',
            message: "No hay cupo suficiente para la reserva"
        };
    } else {
        paquete.cupo = paquete.cupo - cantidad_personas;
        await paquetesServices.editar(paquete_id, paquete.destino_id, paquete.nombre, paquete.precio, paquete.cupo, paquete.fecha_inicio, paquete.fecha_fin);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: 0,
                usuario_id: usuario_id,
                paquete_id: paquete_id,
                fecha_reserva: fecha_reserva,
                cantidad_personas: cantidad_personas
            })
        });
        return response;
    }
}

async function editar(id, usuario_id, paquete_id, fecha_reserva, cantidad_personas) {
    const urlPut = `${url}/${id}`;
    const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            usuario_id: usuario_id,
            paquete_id: paquete_id,
            fecha_reserva: fecha_reserva,
            cantidad_personas: cantidad_personas
        })
    });
    return response;
}

async function borrar(id) {
    const urlDelete = `${url}/${id}`;
    try {
        const response = await fetch(urlDelete, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Error al borrar el elemento');
        }

        const data = await response.json();

        Swal.fire({
            icon: 'success',
            title: data.message,
            showConfirmButton: true,
            timer: 1500
        });

        return data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            showConfirmButton: true
        });
        throw error;
    }
}

async function listarPorUsuario(id) {
    const urlGet = `${url}/usuario_id/${id}`;
    const response = await fetch(urlGet);
    return response.json();
}

export const reservaServices = {
    listar,
    listarPorUsuario,
    crear,
    editar,
    borrar,
};
