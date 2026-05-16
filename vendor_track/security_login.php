<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $_SESSION['admin_logged_in'] = true;
    header("Location: vendor_registration.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Security Login</title>
    <style>
        body { font-family: Arial; background:#f0f0f0; }
        .box { width:350px; margin:auto; background:white; padding:20px; margin-top:50px; border-radius:8px; }
        input { width:100%; padding:12px; margin-bottom:12px; }
        button { width:100%; padding:12px; background:#007bff; color:white; border:none; }
    </style>
</head>
<body>

<div class="box">
    <h2>Security Login</h2>

    <form method="post">
        <input type="text" placeholder="Username" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
</div>