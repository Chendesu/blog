<?php
header("content-type:text/html;charset=utf-8");

$id = $_POST["id"];
$conn = new mysqli("localhost","root","root123","myblog");
if($conn->connect_error){
  $response = array(
    "code"=>500,
    "message"=>"连接失败"
  );
  print_r(json_encode($response));
} else {
  $sql = "delete from label where id='$id'";
  $result = $conn->query($sql);
  if($result){
    $message="OK";
  } else {
    $message = "删除失败";
  }
  $response = array(
    "code" => 200,
    "message" => $message
  );
  print_r(json_encode($response));
}