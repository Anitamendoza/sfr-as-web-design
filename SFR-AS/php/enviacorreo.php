<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '/bat/phpmailer/PHPMailer/src/PHPMailer.php';
require '/bat/phpmailer/PHPMailer/src/Exception.php';
require '/bat/phpmailer/PHPMailer/src/SMTP.php';

$response = array();

// NAME
if (empty($_POST["nombre"])) {
    $response['status'] = "error";
    $response['message'] = "El campo 'Apellidos y Nombres' es obligatorio.";
    echo json_encode($response);
    exit;
} else {
    $name = $_POST["nombre"];
}

// EMAIL
if (empty($_POST["email"])) {
    $response['status'] = "error";
    $response['message'] = "El campo 'Correo Electrónico' es obligatorio.";
    echo json_encode($response);
    exit;
} else {
    $email = $_POST["email"];
}

// PHONE NUMBER
if (empty($_POST["telefono"])) {
    $response['status'] = "error";
    $response['message'] = "El campo 'Teléfono' es obligatorio.";
    echo json_encode($response);
    exit;
} else {
    $phoneNumber = $_POST["telefono"];
}

// MESSAGE
if (empty($_POST["mensaje"])) {
    $response['status'] = "error";
    $response['message'] = "El campo 'Mensaje' es obligatorio.";
    echo json_encode($response);
    exit;
} else {
    $message = $_POST["mensaje"];
}

// Create a new PHPMailer instance
$mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com'; // Cambia esto al servidor SMTP que corresponda
    $mail->SMTPAuth = true;
    $mail->Username = 'anithamendoza151@gmail.com'; // Cambia esto a tu dirección de correo
    $mail->Password = 'tu_contraseña'; // Cambia esto a tu contraseña de correo
    $mail->SMTPSecure = 'tls'; // Puede ser 'ssl' o 'tls', dependiendo de la configuración del servidor
    $mail->Port = 587; // Puerto SMTP

    // Sender information
    $mail->setFrom($email, $name);
    $mail->addAddress('anithamendoza151@gmail.com'); // Dirección de correo del destinatario
    $mail->Subject = 'Nuevo mensaje recibido desde sfraviationsolution.com';
    $mail->Body = "Nombre: $name\nEmail: $email\nTeléfono: $phoneNumber\nMensaje: $message";

    // Send email
    $mail->send();

    $response['status'] = 'success';
    $response['message'] = 'El mensaje se ha enviado correctamente.';
    echo json_encode($response);
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Hubo un error al enviar el mensaje. Inténtelo de nuevo más tarde.';
    echo json_encode($response);
}
?>
