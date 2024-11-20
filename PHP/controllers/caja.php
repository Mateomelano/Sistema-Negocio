<?php
include '../config.php'; // Conexión a la base de datos

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Lógica CRUD de Caja
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        // Obtener una caja por ID
        $id = intval($_GET['id']);
        $query = "SELECT * FROM caja WHERE id_caja = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id]);
        $caja = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($caja);
    } else {
        // Obtener todas las cajas
        $query = "SELECT * FROM caja";
        $stmt = $conn->query($query);
        $cajas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($cajas);
    }
} elseif ($method === 'POST') {
    // Crear una nueva caja
    $data = json_decode(file_get_contents("php://input"), true);

    try {
        $query = "INSERT INTO caja (fecha, total, estado) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data['fecha'],
            $data['total'],
            $data['estado']
        ]);

        echo json_encode(["message" => "Caja creada exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error creando caja: " . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    // Actualizar una caja existente
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id_caja']);

    try {
        $query = "UPDATE caja SET fecha = ?, total = ?, estado = ? WHERE id_caja = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data['fecha'],
            $data['total'],
            $data['estado'],
            $id
        ]);

        echo json_encode(["message" => "Caja actualizada exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error actualizando caja: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Eliminar una caja por ID
    $id = intval($_GET['id']);

    try {
        $query = "DELETE FROM caja WHERE id_caja = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id]);

        echo json_encode(["message" => "Caja eliminada exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error eliminando caja: " . $e->getMessage()]);
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
