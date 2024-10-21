<?php
include 'conexion.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir el archivo de conexión a la base de datos
include 'conexion.php';

// Obtener el RUT desde la solicitud
$data = json_decode(file_get_contents("php://input"));
$rut = $data->rut;

// Validar si el RUT fue proporcionado
if (!$rut) {
    echo json_encode(['success' => false, 'message' => 'RUT es requerido']);
    exit;
}

// Formatear el RUT para eliminar espacios en blanco y convertirlo a minúsculas
$rut = strtolower(trim($rut));

// Preparar la consulta SQL para verificar el RUT
$sql = "SELECT * FROM alumnos WHERE rut = ? AND vigente = TRUE";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $rut);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró un registro válido
if ($result->num_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'RUT no válido o no vigente']);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
