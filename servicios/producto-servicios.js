const url = "http://127.0.0.1:8000/productos";

async function listar(id) {
    let cadUrl;
    if (isNaN(id)) 
      cadUrl = url;
    else
      cadUrl = `${url}/${id}`;
  
    const response = await fetch(cadUrl);
    return response.json();
}

async function crear(nombre, descripcion, precioCoste, precioFinal, codBarra, peso, imagen, idCategoria) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: 0,  // El ID se autogenera en la base de datos
            nombre: nombre,
            descripcion: descripcion,
            precio_coste: precioCoste,
            precio_final: precioFinal,
            cod_barra: codBarra,
            peso: peso,
            imagen: imagen,  // Nueva propiedad imagen
            id_categoria: idCategoria  // Nueva propiedad id_categoria
        })
    });
    return response;
}

async function editar(id, nombre, descripcion, precioCoste, precioFinal, codBarra, peso, imagen, idCategoria) {
    const urlPut = `${url}/${id}`;
    const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,  // Mantiene el ID del producto a editar
            nombre: nombre,
            descripcion: descripcion,
            precio_coste: precioCoste,
            precio_final: precioFinal,
            cod_barra: codBarra,
            peso: peso,
            imagen: imagen,  // Actualiza la imagen si cambia
            id_categoria: idCategoria  // Actualiza la categoría si cambia
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
            throw new Error('Error al borrar el producto');
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

export const productosServices = {
    listar,
    crear,
    editar,
    borrar,
};
