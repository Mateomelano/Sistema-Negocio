<?php
include '../config.php'; // Conexión a la base de datos

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Lógica CRUD de VentaProducto
if ($method === 'GET') {
    if (isset($_GET['id_venta_producto'])) {
        // Obtener un producto específico de una venta por ID de venta_producto
        $id_venta_producto = intval($_GET['id_venta_producto']);
        $query = "SELECT * FROM venta_producto WHERE id_venta_producto = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id_venta_producto]);
        $venta_producto = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($venta_producto);
    } elseif (isset($_GET['id_venta'])) {
        // Obtener todos los productos de una venta específica
        $id_venta = intval($_GET['id_venta']);
        $query = "SELECT * FROM venta_producto WHERE id_venta = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id_venta]);
        $venta_productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($venta_productos);
    } else {
        // Obtener todos los productos de todas las ventas
        $query = "SELECT * FROM venta_producto";
        $stmt = $conn->query($query);
        $venta_productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($venta_productos);
    }
} elseif ($method === 'POST') {
    // Crear un nuevo producto asociado a una venta
    $data = json_decode(file_get_contents("php://input"), true);

    // Procesar los datos para la inserción
    $query = "INSERT INTO venta_producto (id_venta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        $data['id_venta'],
        $data['id_producto'],
        $data['cantidad'],
        $data['subtotal']
    ]);

    echo json_encode(["message" => "Producto asociado a la venta creado exitosamente"]);
} elseif ($method === 'PUT') {
    // Actualizar un producto específico de una venta
    $data = json_decode(file_get_contents("php://input"), true);
    $id_venta_producto = intval($data['id_venta_producto']);

    // Actualizar los detalles del producto
    $query = "UPDATE venta_producto SET id_venta = ?, id_producto = ?, cantidad = ?, subtotal = ? WHERE id_venta_producto = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        $data['id_venta'],
        $data['id_producto'],
        $data['cantidad'],
        $data['subtotal'],
        $id_venta_producto
    ]);

    echo json_encode(["message" => "Producto asociado a la venta actualizado exitosamente"]);
} elseif ($method === 'DELETE') {
    // Eliminar un producto específico de una venta
    $id_venta_producto = intval($_GET['id_venta_producto']);

    // Eliminar el registro de la base de datos
    $query = "DELETE FROM venta_producto WHERE id_venta_producto = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$id_venta_producto]);

    echo json_encode(["message" => "Producto asociado a la venta eliminado exitosamente"]);
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
