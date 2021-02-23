<?php






$uploaddir = '../img/';
$filename = time() . '.'. pathinfo($_FILES['img']['name'])['extension'];



$imgSrc = './img/' . $filename;
$name = $_POST['name'];
$storage = $_POST['storage'];
$category = $_POST['category'];
$ingredients = $_POST['ingredients'];
$password = $_POST['password'];
if($password != 'BRUTOR'){

    exit("ERRORPASS");
}




if (move_uploaded_file($_FILES['img']['tmp_name'], $uploaddir . $filename)) {
    require('./connect.php');
    $mysqli = $connect;
    $sql = "INSERT INTO  `dishes` (`name`, `category`, `storage`, `imgSrc`, `ingredients` )
    VALUES ('$name', '$category', '$storage', '$imgSrc', '$ingredients')";
    
if($mysqli->query($sql)) echo "OK"; else echo "ERROR";;

} else {
    echo "ERROR";
}?>





