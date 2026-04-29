<?php
session_start();
include "db_connection.php";

$error = "";

if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username=? AND password=?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $_SESSION['admin'] = $username;
        header("Location: admin_dashboard.php");
        exit;
    } else {
        $error = "Invalid login!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Admin Login</title>
<style>
body{font-family:Arial;background:#f2f2f2;}
.box{width:350px;margin:auto;margin-top:100px;background:white;padding:20px;border-radius:8px;}
input,button{width:100%;padding:10px;margin:10px 0;}
button{background:#1f3c88;color:white;border:none;}
.error{color:red;}
</style>
</head>
<body>

<div class="box">
<h2>Admin Login</h2>
<form method="post">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button name="login">Login</button>
</form>

<?php if($error) echo "<p class='error'>$error</p>"; ?>
</div>

</body>
</html>
