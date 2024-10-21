<?php
// Configurar la conexión a la base de datos
$servername = "localhost"; 
$username = "root";  // Cambia esto si usas otro usuario
$password = "";  // Cambia esto si tu MySQL tiene contraseña
$dbname = "universidad";  // Cambia esto al nombre real de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error en la conexión a la base de datos: " . $conn->connect_error);
}
?>
