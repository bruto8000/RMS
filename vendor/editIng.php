<?php






$uploaddir = '../img/';
$filename = time() . '.'. pathinfo($_FILES['img']['name'])['extension'];


$imgSrc = './img/' . $filename;

if($_POST['img'] == 'none'){$imgSrc = 'none';};
$name = $_POST['name'];
$storage = $_POST['storage'];
$category = $_POST['category'];
$id = $_POST['id'];
$password = $_POST['password'];
if($password != 'BRUTOR'){

    exit("ERRORpass");
}


if($imgSrc == 'none'){
    $sql = "UPDATE  ingredients 
    SET name='$name', category='$category', storage='$storage'
    WHERE id = '$id'";
 require('./connect.php');
 $mysqli = $connect;
    if($mysqli->query($sql)) echo "OK"; else echo "ERRORsqlImg=none";

}else{

if (move_uploaded_file($_FILES['img']['tmp_name'], $uploaddir . $filename)) {
    require('./connect.php');
    $mysqli = $connect;
    $sql = "UPDATE  ingredients 
    SET name='$name', category='$category', storage='$storage', imgSrc='$imgSrc'
    WHERE id ='$id'";
    
if($mysqli->query($sql)) echo "OK"; else echo "ERRORSqlImgYes";;

} else {
    echo "ERRORprost";
}

}?>





