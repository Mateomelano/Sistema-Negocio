<?php
include '../config.php'; // Conexión a la base de datos

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Lógica CRUD de ventas
if ($method === 'GET') {
    if (isset($_GET['id_venta'])) {
        // Obtener una venta por ID
        $id_venta = intval($_GET['id_venta']);
        $query = "SELECT * FROM venta WHERE id_venta = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id_venta]);
        $venta = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($venta) {
            // Obtener los productos asociados a la venta
            $query_productos = "SELECT * FROM venta_producto WHERE id_venta = ?";
            $stmt_productos = $conn->prepare($query_productos);
            $stmt_productos->execute([$id_venta]);
            $venta['productos'] = $stmt_productos->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($venta);
    } else {
        // Obtener todas las ventas
        $query = "SELECT * FROM venta";
        $stmt = $conn->query($query);
        $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($ventas as &$venta) {
            // Obtener los productos asociados para cada venta
            $query_productos = "SELECT * FROM venta_producto WHERE id_venta = ?";
            $stmt_productos = $conn->prepare($query_productos);
            $stmt_productos->execute([$venta['id_venta']]);
            $venta['productos'] = $stmt_productos->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($ventas);
    }
} elseif ($method === 'POST') {
    // Crear una nueva venta con productos asociados
    $data = json_decode(file_get_contents("php://input"), true);

    // Crear la venta
    $query = "INSERT INTO venta (id_usuario, total, tipo_pago, fecha) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        $data['id_usuario'],
        $data['total'],
        $data['tipo_pago'],
        $data['fecha']
    ]);
    $id_venta = $conn->lastInsertId();

    // Asociar los productos a la venta
    foreach ($data['productos'] as $producto) {
        $query_producto = "INSERT INTO venta_producto (id_venta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)";
        $stmt_producto = $conn->prepare($query_producto);
        $stmt_producto->execute([
            $id_venta,
            $producto['id_producto'],
            $producto['cantidad'],
            $producto['subtotal']
        ]);
    }

    echo json_encode(["message" => "Venta creada", "id_venta" => $id_venta]);
} elseif ($method === 'PUT') {
    // Actualizar una venta y sus productos asociados
    $data = json_decode(file_get_contents("php://input"), true);
    $id_venta = intval($data['id_venta']);

    // Actualizar los detalles de la venta
    $query = "UPDATE venta SET id_usuario = ?, total = ?, tipo_pago = ?, fecha = ? WHERE id_venta = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        $data['id_usuario'],
        $data['total'],
        $data['tipo_pago'],
        $data['fecha'],
        $id_venta
    ]);

    // Eliminar los productos existentes de la venta
    $query_delete_productos = "DELETE FROM venta_producto WHERE id_venta = ?";
    $stmt_delete = $conn->prepare($query_delete_productos);
    $stmt_delete->execute([$id_venta]);

    // Agregar los productos actualizados
    foreach ($data['productos'] as $producto) {
        $query_producto = "INSERT INTO venta_producto (id_venta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)";
        $stmt_producto = $conn->prepare($query_producto);
        $stmt_producto->execute([
            $id_venta,
            $producto['id_producto'],
            $producto['cantidad'],
            $producto['subtotal']
        ]);
    }

    echo json_encode(["message" => "Venta actualizada"]);
} elseif ($method === 'DELETE') {
    // Eliminar una venta y sus productos asociados
    $id_venta = intval($_GET['id_venta']);

    // Eliminar los productos asociados a la venta
    $query_delete_productos = "DELETE FROM venta_producto WHERE id_venta = ?";
    $stmt_delete_productos = $conn->prepare($query_delete_productos);
    $stmt_delete_productos->execute([$id_venta]);

    // Eliminar la venta
    $query_delete_venta = "DELETE FROM venta WHERE id_venta = ?";
    $stmt_delete_venta = $conn->prepare($query_delete_venta);
    $stmt_delete_venta->execute([$id_venta]);

    echo json_encode(["message" => "Venta eliminada"]);
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
