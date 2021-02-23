<?php






$uploaddir = '../img/';
$filename = time() . '.'. pathinfo($_FILES['img']['name'])['extension'];


$imgSrc = './img/' . $filename;
if($_POST['img'] === 'none'){$imgSrc = 'none';};
$name = $_POST['name'];
$storage = $_POST['storage'];
$category = $_POST['category'];
$id = $_POST['id'];
$password = $_POST['password'];
$ingredients = $_POST['ingredients'];
if($password != 'BRUTOR'){

    exit("ERRORpass");
}

// echo  "name='$name', ingredients='$ingredients', category='$category', storage='$storage', imgSrc='$imgSrc', id = $id";
if($imgSrc == 'none'){
    $sql = "UPDATE  dishes 
    SET name='$name', category='$category', storage='$storage', ingredients='$ingredients'
    WHERE id = '$id'";
 require('./connect.php');
 $mysqli = $connect;
    if($mysqli->query($sql)) echo "OKSQLnoIMG"; else echo "ERRORsqlImg=none";

}else{

if (move_uploaded_file($_FILES['img']['tmp_name'], $uploaddir . $filename)) {
    require('./connect.php');
    $mysqli = $connect;
    $sql = "UPDATE  dishes 
    SET name='$name', ingredients='$ingredients', category='$category', storage='$storage', imgSrc='$imgSrc'
    WHERE id ='$id'";
 
    
if($mysqli->query($sql)) echo "OKSQLIMG"; else echo "ERRORSqlImgYes";;

} else {
    echo "ERRORprost";
}

}?>





