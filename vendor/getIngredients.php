<?php


require_once('./connect.php');
mysqli_query($connect,'SET NAMES utf8');
if($mysqli->connect_error){
    die('Connect Error: '.$mysqli->connect_error);
    
}


    $mysqli = $connect;

    $sql = "SELECT * FROM ingredients";
    $res = $mysqli->query($sql);
    if($res->num_rows > 0){
        $result= $res->fetch_all(MYSQLI_ASSOC);	
    }
    else 
    {
        $result = (object)['status'=>'ERROR', 'body' => 'Nodishes'];
    }

    echo json_encode($result); 



