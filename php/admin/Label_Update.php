<?php
$database = include "./database.php";
if($database == 0){
  $response = array(
    "code"=>500,
    "message"=>"连接失败"
  );
  print_r(json_encode($response));
} else {
  $id = $_POST["id"];
  $label = $_POST["label"];

  $sql = "select * from label where id='$id'";
  $result = $conn->query($sql);
  $num = mysqli_num_rows($result);
  if($num==1){
    $sql_query = "select * from label where labelname='$label'";
    $result_query = $conn->query($sql_query);
    $num_query = mysqli_num_rows($result_query);
    if($num_query>=1){
      $message = "标签名已存在，修改失败";
    } else {
      $sql_update = "update label set labelname='$label' where id='$id'";
      $result_update = $conn->query($sql_update);
      if($result_update){
        $message = "OK";
      } else {
        $message = "修改失败";
      }
    }
  } else {
    $message = "修改失败";
  }
  $response = array(
    "code"=>200,
    "message"=>$message
  );
  print_r(json_encode($response));
}