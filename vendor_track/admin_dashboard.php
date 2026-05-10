<?php
session_start();
include "db_connection.php";

// Check admin login
if (!isset($_SESSION['admin'])) {
    header("Location: admin_login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <style>
        body { font-family: Arial; background:#f2f2f2; }
        .box { width:300px; margin:50px auto; background:white; padding:20px; text-align:center; border-radius:8px; }
        a { display:block; padding:12px; margin:10px; background:#007bff; color:white; text-decoration:none; }
        a:hover { background:#0056b3; }
    </style>
</head>
<body>


<div class="box">
    <h2>Admin Dashboard</h2>
    <a href="view_vendors.php">View Vendors</a>
    <a href="logout.php">Logout</a>
</div>

</body>
</html>
