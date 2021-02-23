<?php



require('./connect.php');
$mysqli = $connect;


$id = $_POST['id'];

$password = $_POST['password'];
if($password != 'BRUTOR'){

    exit("ERRORPASS");
}



$sql = "DELETE FROM dishes WHERE id = '$id'";

if($mysqli->query($sql)) echo "OK"; else echo "ERRORsql";;


?>


