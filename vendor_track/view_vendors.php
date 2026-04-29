<?php
session_start();
include "db_connection.php";

// Check admin login
if (!isset($_SESSION['admin'])) {
    header("Location: admin_login.php");
    exit;
}

// Fetch vendors
$result = $conn->query("SELECT * FROM vendor_info");
?>

<!DOCTYPE html>
<html>
<head>
    <title>View Vendors</title>
    <style>
        body { font-family: Arial; background:#eef2f3; }
        table { width:95%; margin:auto; border-collapse:collapse; background:white; }
        th, td { padding:10px; border:1px solid #ccc; text-align:center; }
        th { background:#007bff; color:white; }
        img { width:80px; border-radius:6px; }
        h2 { text-align:center; }
    </style>
</head>
<body>

<h2>Registered Vendors</h2>

<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Aadhaar</th>
        <th>Mobile</th>
        <th>Vendor Type</th>
        <th>Photo</th>
        <th>PIN</th>
        <th>Check-in</th>
        <th>Check-out</th>
    </tr>

<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?= $row['id'] ?></td>
    <td><?= $row['vendor_name'] ?></td>
    <td><?= $row['aadhaar_number'] ?></td>
    <td><?= $row['vendor_mobile'] ?></td>
    <td><?= $row['vendor_type'] ?></td>
    <td>
        <img src="upload/<?= $row['aadhaar_photo'] ?>">
    </td>
    <td><?= $row['pin'] ?></td>
    <td><?= $row['check_in_time'] ?></td>
    <td><?= $row['check_out_time'] ?></td>
</tr>
<?php endwhile; ?>

</table>

</body>
</html>
