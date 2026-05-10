<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vendor_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

if (!isset($_GET['pin'])) die("No vendor PIN provided.");

$pin = $_GET['pin'];
$sql = "SELECT * FROM vendor_info WHERE pin='$pin'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $vendor = $result->fetch_assoc();
} else {
    die("Vendor not found.");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vendor Registration Success</title>
</head>
<body>
    <h2>Vendor Registration Successful!</h2>
    <p><strong>Vendor Name:</strong> <?php echo $vendor['vendor_name']; ?></p>
    <p><strong>Aadhaar Number:</strong> <?php echo $vendor['aadhaar_number']; ?></p>
    <p><strong>Mobile Number:</strong> <?php echo $vendor['vendor_mobile']; ?></p>
    <p><strong>Vendor Type:</strong> <?php echo $vendor['vendor_type']; ?></p>
    <p><strong>Vendor PIN:</strong> <?php echo $vendor['pin']; ?></p>
    <p><img src="uploads/<?php echo $vendor['aadhaar_photo']; ?>" width="150" alt="Aadhaar Photo"></p>

    <a href="vendor_registration.php">Register Another Vendor</a>
</body>
</html>