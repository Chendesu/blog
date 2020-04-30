<?php
header("content-type:text/html;charset=utf-8");

$id = $_POST["id"];
$password = $_POST["password"];

$conn = new mysqli("localhost", "root", "root123", "myblog");
if($conn->connect_error) {
  $response = array(
    "code"=>500,
    "message"=>"连接失败"
  );
  print_r(json_encode($response));
} else {
  $sql = "select * from user where id='{$id}'";
  $result = $conn->query($sql);
  $num = mysqli_num_rows($result);
  if($num==1){
    $sql_update = "update user set password='{$password}' where id='{$id}'";
    $result_update = $conn->query($sql_update);
    if($result) {
      $message = "OK";
    } else {
      $message = "fail";
    }
  } else {
    $message = "fail";
  }
  $response = array(
    "code" => 200,
    "message" => $message
  );
  print_r(json_encode($response));

}