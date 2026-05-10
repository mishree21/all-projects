<?php
include "db_connection.php";

$message = "";
$vendor = null;

if (isset($_POST['login'])) {
    $pin = $_POST['pin'];

    $stmt = $conn->prepare("SELECT * FROM vendor_info WHERE pin = ?");
    $stmt->bind_param("s", $pin);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $vendor = $result->fetch_assoc();
    } else {
        $message = "Invalid PIN!";
    }
}

if (isset($_POST['check_in'])) {
    $id = $_POST['vendor_id'];
    $stmt = $conn->prepare("UPDATE vendor_info SET check_in_time = NOW() WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $message = "Check-In Successful!";
}

if (isset($_POST['check_out'])) {
    $id = $_POST['vendor_id'];
    $stmt = $conn->prepare("UPDATE vendor_info SET check_out_time = NOW() WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $message = "Check-Out Successful!";
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Vendor Login</title>
<style>
body{font-family:Arial;text-align:center;background:#eef2f3;padding-top:40px;}
.box{width:350px;margin:auto;background:white;padding:20px;border-radius:10px;}
input{width:90%;padding:10px;margin:10px;}
button{padding:10px 20px;margin:10px;background:#28a745;color:white;border:none;}
.btn2{padding:10px 20px;margin:10px;background:#007bff;color:white;border:none;}
.msg{color:red;font-size:18px;}
</style>
</head>

<body>

<h2>Vendor Login</h2>

<div class="box">
<form method="post">
    <input type="text" name="pin" placeholder="Enter PIN" required>
    <button type="submit" name="login">Login</button>
</form>
</div>

<?php if($message != ""): ?>
    <p class="msg"><?= $message ?></p>
<?php endif; ?>

<?php if($vendor): ?>
<br>
<div class="box">
    <h3>Welcome: <?= $vendor['vendor_name'] ?></h3>

    <form method="post">
        <input type="hidden" name="vendor_id" value="<?= $vendor['id'] ?>">

        <button type="submit" name="check_in">Check-in</button>
        <button type="submit" name="check_out" class="btn2">Check-out</button>
    </form>

    <p>Check-in Time: <?= $vendor['check_in_time'] ?></p>
    <p>Check-out Time: <?= $vendor['check_out_time'] ?></p>
</div>
<?php endif; ?>

</body>
</html>
