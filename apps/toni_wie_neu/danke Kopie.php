<?php
// mail
$empfaenger = 'hello@lorenastrohner.ch';
$absender = 'Lorena Strohner';
$absenderAdresse = 'noreply@lorenastrohner.ch';
$cc = array(
    'hello@lorenastrohner.ch',
);
$kategorieEmpfaenger = array(
    'Drucker'   => 'wackerpascal@gmail.com',
    'Fenster'   => 'wacker@toasted.ch',
);
$betreff = 'Neue Mangel-Meldung';
$filename = 'TWN_image';
$kategorieMapping = array(
    'Drucker'   => 'Drucker',
    'Fenster'   => 'Fenster',
    'Auswaehlen'=> 'Nicht ausgewählt',
);

// Text
$kategorie = $_POST['kategorie'] || '';
$beschreibung = $_POST['beschreibung'] || '';
$location = $_POST['location'] || '';
$name = $_POST['name'] || '';
$vorname = $_POST['vorname'] || '';

$mailBody = "Guten Tag<br /><br />
Ueber Toni wie Neu wurde ein Mangel gemeldet:<br /><br />
Infos:<br />
Kategorie: " . $kategorieMapping[$kategorie] . "<br />
Beschreibung: " . $beschreibung . "<br />
Ort: " . $location . "<br />
Melder: " . $vorname . " " . $name . "<br />
<br />
By Lorena Strohner.
";


/**
 * Ab hier nichts ändern!
 */
// Bild
$file = $_FILES['file']['tmp_name'];
$file_type = $_FILES['file']['type'];
$filename .= '.' + (strtolower($file_type) == 'image/png' ? 'png' : 'jpg');

// mail setup
if (isset($kategorieEmpfaenger[$kategorie])) {
    $empfaenger = $kategorieEmpfaenger[$kategorie];
}

try {
require(getcwd() . '/PHPMailer/PHPMailerAutoload.php');

$mail = new PHPMailer();
$mail->isMail();

$mail->From = $absenderAdresse;
$mail->FromName = $absender;
$mail->addAddress($empfaenger);
/*if (is_array($cc) && !empty($cc)) {
    foreach ($cc as $emailAdresse) {
        $mail->addCC($emailAdresse);
    }
}*/
$mail->addReplyTo('noreply@lorenastrohner.ch', 'Noreply');

//$mail->addAttachment($file, $filename)
$mail->isHTML(true);

$mail->Subject = $betreff;
$mail->Body = $mailBody;
$mail->AltBody = strip_tags($mailBody);

if ($mail->send()) {
    //echo 'erfolg';
    include(getcwd() . '/erfolg.html');
} else {
    echo 'Nope. Fehlerinfo: ';
    echo $mail->ErrorInfo;
    //include(getcwd() . '/error.html');
}
} catch (Exception $e) {
    var_dump($e->getMessage());
}