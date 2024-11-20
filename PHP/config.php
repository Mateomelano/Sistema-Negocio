<?php
$host = 'darkslategrey-bear-314610.hostingersite.com';
$dbname = 'u305359196_Prueba1';
$username = 'u305359196_Prueba1'; // Cambiar por tu usuario MySQL
$password = 'q8[Hazx8HS'; // Cambiar por tu contraseña

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>