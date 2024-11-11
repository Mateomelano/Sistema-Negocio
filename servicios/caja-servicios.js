const urlCaja = "http://127.0.0.1:8000/ventas"; // URL base para la caja
const urlProductos = "http://127.0.0.1:8000/productos"; // URL para obtener productos

// Listar productos por código de barra o por nombre
async function obtenerProductoPorCodigoBarras(codigoBarra) {
    
    const urlProducto = `${urlProductos}/cod_barra/${codigoBarra}`;

    try {
        const response = await fetch(urlProducto);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json(); // Devolver el producto encontrado
    } catch (error) {
        console.error('Error fetching product by code:', error);
        return null; // Si no se encuentra el producto, devolver null
    }
}


// Crear nueva venta con productos agregados
async function realizarVenta(idUsuario, productos, total) {
    const urlVenta = urlCaja; // Usa la URL base de caja para registrar la venta
    debugger
    const ventaData = {
        id_usuario: parseInt(idUsuario, 10),  // Asegurarnos de que el ID sea un número
        total: total,           // Precio total
        tipo_pago: "Efectivo",  // Se puede cambiar según el tipo de pago seleccionado
        fecha: new Date().toISOString().split("T")[0],  // Fecha actual en formato ISO (solo la fecha)
        productos: productos.map(producto => ({
            id_producto: producto.id,
            cantidad: producto.cantidad,
            subtotal: producto.subtotal,
            id_categoria: producto.idCategoria
        }))  // Mantener productos como array
    };
    console.log(ventaData)
    debugger

    try {
        const response = await fetch(urlVenta, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ventaData)  // Enviar la venta como JSON
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json(); // Devolver la respuesta de la venta
    } catch (error) {
        console.error('Error processing sale:', error);
        throw error;  // Lanzar el error para manejarlo en el frontend
    }
}


// Obtener historial de ventas realizadas (opcional si es necesario)
async function obtenerHistorialVentas() {
    const urlHistorial = `${urlCaja}/historial`;

    try {
        const response = await fetch(urlHistorial);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json(); // Devolver las ventas en formato JSON
    } catch (error) {
        console.error('Error fetching sales history:', error);
        return [];  // En caso de error, devolver un array vacío
    }
}

export const cajaServices = {
    obtenerProductoPorCodigoBarras,
    realizarVenta,
    obtenerHistorialVentas
};
