const url = "http://127.0.0.1:8000/paquetes";

async function listar(id) {
    let cadUrl;
    if (isNaN(id)) 
      cadUrl = url;
    else
      cadUrl = `${url}/${id}`;
  
    const response = await fetch(cadUrl);
    return response.json();
}

async function crear(nombre, destino_id, precio, cupo, fecha_inicio, fecha_fin) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: 0,
            destino_id: destino_id,
            nombre: nombre,
            precio: precio,
            cupo: cupo,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
        })
    });
    return response;
}

async function editar(id, destino_id, nombre, precio, cupo, fecha_inicio, fecha_fin) {
    const urlPut = `${url}/${id}`;
    const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            destino_id: destino_id,
            nombre: nombre,
            precio: precio,
            cupo: cupo,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
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

export const paquetesServices = {
    listar,
    crear,
    editar,
    borrar,
};
