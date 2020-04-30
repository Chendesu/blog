<?php
header("content-type:text/html;charset=utf-8");
session_start();
$username = $_POST["username"];
$password = $_POST["password"];

$conn = new mysqli("localhost","root","root123", "myblog");
if($conn->connect_error){
  $response = array(
    "code" => 500,
    "message" => "连接失败"
  );
  print_r(json_encode($response));
} else {
  $sql="select * from user where username='{$username}' and password='{$password}'";
  $result = $conn->query($sql);
  $num = mysqli_num_rows($result);
  if($num==1){
    $rows = mysqli_fetch_array($result);
    $_SESSION["username"] = $rows["username"];
    $_SESSION["power"] = $rows["power"];
    $message = "OK";

    $user = $rows["username"];
    $user_power = $rows["power"];
  } else {
    $message = "fail";
  }
  $response = array(
    "code" => 200,
    "message" => $message,
    "username"=> $user,
    "power"=> $user_power
  );
  print_r(json_encode($response));
}