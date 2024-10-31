const urlCaja = "http://127.0.0.1:8000/caja"; // URL base para la caja
const urlProductos = "http://127.0.0.1:8000/productos"; // URL para obtener productos

// Listar productos por código de barra o por nombre
async function obtenerProductoPorCodigoBarras(codigoBarra) {
    debugger
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
async function realizarVenta(productos, total) {
    debugger
    const urlVenta = urlCaja; // Usa la URL base de caja para registrar la venta
    const ventaData = {
        productos: productos,  // Lista de productos agregados
        total: total,  // Precio total
        fecha: new Date().toISOString(),  // Fecha actual en formato ISO
        tipo_pago: "Efectivo"  // Se puede cambiar según el tipo de pago seleccionado
    };

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
