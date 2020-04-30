<?php
header("content-type:text/html;charset=utf-8");
session_start();
$user = $_SESSION["username"];
$user_power = $_SESSION["power"];
if(isset($_POST["page"])) {
  $page = $_POST["page"];//页码
} else {
  $page = 1;
}
if (isset($_POST["page"])) {
  $pageSize = $_POST["pageSize"]; //每页显示条数
} else {
  $pageSize = 10;
}

$conn = new mysqli("localhost", "root", "root123", "myblog");
if($conn->connect_error) {
  $response = array(
    "code"=>500,
    "message"=>"连接失败"
  );
  print_r(json_encode($response));
} else {
  $sql = "select * from user order by id desc limit ".($page-1)*$pageSize.", {$pageSize}";
  $result = $conn->query($sql);
  $data = array();
  while($row=mysqli_fetch_array($result)){
    $array = array(
      "id"=>$row["id"],
      "username"=>$row["username"],
      "password"=>$row["password"],
      "power"=>$row["power"]
    );
    array_push($data, $array);
  }
  $total_sql = "select count(*) from user";//总条数
  $total_result = mysqli_fetch_array($conn->query($total_sql));
  $total = $total_result[0];
  $total_pages = ceil($total/$pageSize);//总页数
  $response = array(
    "code" => 200,
    "message" => "OK",
    "data"=>$data,
    "total"=> $total,
    "totalPages"=> $total_pages,
    "username"=> $user,
    "power"=> $user_power
  );
  print_r(json_encode($response));

}