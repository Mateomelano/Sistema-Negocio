const url = "http://127.0.0.1:8000/categorias";

async function listar(id) {
    let cadUrl;
    if (isNaN(id)) 
      cadUrl = url;
    else
      cadUrl = `${url}/${id}`;
  
    const response = await fetch(cadUrl);
    return response.json();
}

async function crear(nombre, descripcion) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: 0,  // El ID se autogenera en la base de datos
            nombre: nombre,
            descripcion: descripcion
        })
    });
    return response;
}

async function editar(id, nombre, descripcion) {
    const urlPut = `${url}/${id}`;
    const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_categoria: id,  // Cambia `id` por `id_categoria` para que coincida con el nombre que espera la API
            nombre: nombre,
            descripcion: descripcion
        })
    });
    
    // Maneja la respuesta
    if (!response.ok) {
        const errorData = await response.json(); // Obtiene los detalles del error
        throw new Error(`Error: ${errorData.message || 'No se pudo editar la categoría'}`);
    }

    return response.json(); // Devuelve la respuesta JSON si la edición fue exitosa
}


async function borrar(id) {
    debugger
    const urlDelete = `${url}/${id}`;
    try {
        const response = await fetch(urlDelete, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Error al borrar la categoría');
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

export const categoriasServices = {
    listar,
    crear,
    editar,
    borrar,
};
