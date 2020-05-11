<?php
header("content-type:text/html;charset=utf-8");

$label = $_POST["label"];
$username = $_POST["username"];

$conn = new mysqli("localhost","root", "root123","myblog");
if($conn->connect_error){
  $response = array(
    "code"=>500,
    "message"=>"连接失败"
  );
  print_r(json_encode($response));
} else {
  $sql = "select * from label where labelname='{$label}'";
  $result = $conn->query($sql);
  $num = mysqli_num_rows($result);
  if($num >= 1) {
    $message = "标签名已存在，添加失败";
  } else {
    $sql_insert = "insert into label (labelname, username) values('{$label}','{$username}')";
    $result_insert = $conn->query($sql_insert);
    if($result_insert){
      $message = "OK";
    } else {
      $message = "添加失败，请稍后重试";
    }
  }
  $response = array(
    "code"=>200,
    "message"=>$message
  );
  print_r(json_encode($response));
}