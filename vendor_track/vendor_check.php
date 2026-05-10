<?php
// Start session
session_start();

// Include database connection
include 'db_connection.php';

// Initialize error message
$error = '';

if (isset($_POST['login'])) {
    // Get PIN from form and trim spaces
    $pin = trim($_POST['pin']);

    if (!empty($pin)) {
        // Prepare SQL to prevent SQL injection
        $stmt = $conn->prepare("SELECT * FROM vendor_info WHERE pin = ?");
        $stmt->bind_param("s", $pin); // Treat PIN as string
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            // Vendor found, fetch data
            $vendor = $result->fetch_assoc();
            
            // Store vendor info in session
            $_SESSION['vendor_id'] = $vendor['id'];
            $_SESSION['vendor_name'] = $vendor['vendor_name'];
            
            // Redirect to check-in page
            header("Location: vendor_check.php");
            exit;
        } else {
            $error = "Invalid PIN. Please try again.";
        }
    } else {
        $error = "Please enter your PIN.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vendor Login</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
        input { padding: 10px; margin: 5px; width: 200px; }
        button { padding: 10px 20px; }
        .error { color: red; margin-top: 10px; }
    </style>
</head>
<body>
    <h2>Vendor Login</h2>
    <form method="post">
        <input type="text" name="pin" placeholder="Enter your PIN" required><br>
        <button type="submit" name="login">Login</button>
    </form>
    <?php if($error != '') { echo "<div class='error'>$error</div>"; } ?>
</body>
</html>