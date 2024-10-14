const url = "http://127.0.0.1:8000/productos";
import { categoriasServices } from "./categoria-servicios.js";
async function listar(id) {
    let cadUrl;
    if (isNaN(id)) 
      cadUrl = url;
    else
      cadUrl = `${url}/${id}`;
  
    const response = await fetch(cadUrl);
    return response.json();
}

async function crear(productoData) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productoData)  // Enviar los datos como JSON
    });
    return response;
}


async function editar(id_producto,nombre,descripcion,precioCoste, precioFinal, codBarra, peso, imagen, idCategoria) {
    const urlPut = `${url}/${id_producto}`;  // Usa id_producto en lugar de id
    const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_producto: id_producto,  // Mantiene el ID del producto a editar
            nombre: nombre,
            descripcion: descripcion,
            precio_coste: parseFloat(precioCoste),  // Asegúrate de que los valores sean correctos
            precio_final: parseFloat(precioFinal),
            cod_barra: codBarra,
            peso: parseFloat(peso),
            imagen: imagen,  // Actualiza la imagen si cambia
            id_categoria: parseInt(idCategoria)  // Asegúrate de que sea un número
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
