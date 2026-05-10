<?php
session_start();
unset($_SESSION['admin_authenticated']);
header("Location: index.php");
exit;
?>