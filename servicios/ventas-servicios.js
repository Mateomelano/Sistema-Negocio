const url = "http://127.0.0.1:8000/ventas"; // URL base para las ventas

async function listar(id) {
    let cadUrl;
    if (isNaN(id)) 
      cadUrl = url;
    else
      cadUrl = `${url}/${id}`;
  
    const response = await fetch(cadUrl);
    return response.json();
}

async function crear(ventaData) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData)  // Enviar los datos como JSON
    });
    return response;
}

async function editar(id_venta, id_producto, id_usuario, total, cantidadProducto, tipoPago, fecha) {
    const urlPut = `${url}/${id_venta}`;  // Usa id_venta en lugar de id
    const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_venta: id_venta,  // Mantiene el ID de la venta a editar
            id_producto: id_producto,  // ID del producto asociado
            id_usuario: id_usuario,    // ID del usuario que realizó la venta
            total: parseFloat(total),  // Asegúrate de que los valores sean correctos
            cantidad_producto: parseInt(cantidadProducto),  // Cantidad de productos vendidos
            tipo_pago: tipoPago,  // Método de pago
            fecha: fecha  // Fecha de la venta
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
            throw new Error('Error al borrar la venta');
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

export const ventasServices = {
    listar,
    crear,
    editar,
    borrar,
};
