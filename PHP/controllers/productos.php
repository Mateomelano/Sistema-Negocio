<?php
include '../config.php'; // Archivo que incluye la conexión a la base de datos

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Lógica CRUD de productos
if ($method === 'GET') {
    if (isset($_GET['id_producto'])) {
        // Obtener producto por ID
        $id_producto = intval($_GET['id_producto']);
        $query = "SELECT * FROM productos WHERE id_producto = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$id_producto]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } elseif (isset($_GET['cod_barra'])) {
        // Obtener producto por código de barras
        $cod_barra = $_GET['cod_barra'];
        $query = "SELECT * FROM productos WHERE cod_barra = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$cod_barra]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } else {
        // Obtener todos los productos
        $query = "SELECT * FROM productos";
        $stmt = $conn->query($query);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }
} elseif ($method === 'POST') {
    // Crear un nuevo producto
    $data = json_decode(file_get_contents("php://input"), true);
    $query = "INSERT INTO productos (nombre, cod_barra, descripcion, precio_coste, precio_final, peso, imagen, id_categoria, stock) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        $data['nombre'],
        $data['cod_barra'],
        $data['descripcion'],
        $data['precio_coste'],
        $data['precio_final'],
        $data['peso'],
        $data['imagen'],
        $data['id_categoria'],
        $data['stock']
    ]);
    echo json_encode(["message" => "Producto creado", "id_producto" => $conn->lastInsertId()]);
} elseif ($method === 'PUT') {
    // Actualizar un producto
    $data = json_decode(file_get_contents("php://input"), true);
    $id_producto = intval($data['id_producto']);
    $query = "UPDATE productos 
              SET nombre = ?, cod_barra = ?, descripcion = ?, precio_coste = ?, precio_final = ?, peso = ?, imagen = ?, id_categoria = ?, stock = ? 
              WHERE id_producto = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        $data['nombre'],
        $data['cod_barra'],
        $data['descripcion'],
        $data['precio_coste'],
        $data['precio_final'],
        $data['peso'],
        $data['imagen'],
        $data['id_categoria'],
        $data['stock'],
        $id_producto
    ]);
    echo json_encode(["message" => "Producto actualizado"]);
} elseif ($method === 'DELETE') {
    // Eliminar un producto
    $id_producto = intval($_GET['id_producto']);
    $query = "DELETE FROM productos WHERE id_producto = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$id_producto]);
    echo json_encode(["message" => "Producto eliminado"]);
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
