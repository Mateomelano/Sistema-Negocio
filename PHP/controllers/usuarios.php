<?php
include '../config.php'; // Conexión a la base de datos

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Lógica CRUD de Usuarios
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        // Obtener un usuario por ID
        $id = intval($_GET['id']);
        $query = "SELECT * FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($usuario);
    } elseif (isset($_GET['email'])) {
        // Obtener un usuario por email
        $email = $_GET['email'];
        $query = "SELECT * FROM usuarios WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($usuario);
    } else {
        // Obtener todos los usuarios
        $query = "SELECT * FROM usuarios";
        $stmt = $conn->query($query);
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($usuarios);
    }
} elseif ($method === 'POST') {
    // Crear un nuevo usuario
    $data = json_decode(file_get_contents("php://input"), true);

    try {
        $query = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data['nombre'],
            $data['email'],
            password_hash($data['password'], PASSWORD_DEFAULT), // Hashear contraseña
            $data['rol']
        ]);

        echo json_encode(["message" => "Usuario creado exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error creando usuario: " . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    // Actualizar un usuario existente
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);

    try {
        $query = "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data['nombre'],
            $data['email'],
            password_hash($data['password'], PASSWORD_DEFAULT), // Hashear contraseña
            $data['rol'],
            $id
        ]);

        echo json_encode(["message" => "Usuario actualizado exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error actualizando usuario: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Eliminar un usuario por ID
    $id = intval($_GET['id']);

    try {
        $query = "DELETE FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id]);

        echo json_encode(["message" => "Usuario eliminado exitosamente"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Error eliminando usuario: " . $e->getMessage()]);
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
