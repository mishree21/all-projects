<?php
session_start();

/* 🔐 SECURITY LOGIN CHECK */
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: security_login.php");
    exit();
}

include "db_connection.php";

$message = "";
$generated_pin = "";
$vendor_details = null;

/* 🔒 CLEAN INPUT (TEXT ONLY) */
function clean_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

if (isset($_POST['register'])) {

    /* 🧹 SANITIZE INPUTS */
    $name        = clean_input($_POST['name']);
    $vendor_type = clean_input($_POST['vendor_type']);

    // 🔥 REMOVE ALL SPACES
    $aadhaar = preg_replace('/\s+/', '', $_POST['aadhaar']);
    $mobile  = preg_replace('/\s+/', '', $_POST['mobile']);

    /* 🔢 VALIDATION */
    if (!preg_match("/^[0-9]{12}$/", $aadhaar)) {
        $message = "Invalid Aadhaar Number!";
    } elseif (!preg_match("/^[0-9]{10}$/", $mobile)) {
        $message = "Invalid Mobile Number!";
    } else {

        /* 📸 PHOTO UPLOAD SECURITY */
        $photo = "";
        if (!empty($_FILES['photo']['name'])) {

            $allowed_types = ['image/jpg', 'image/jpeg', 'image/png'];
            $file_type = $_FILES['photo']['type'];
            $file_size = $_FILES['photo']['size'];

            if (!in_array($file_type, $allowed_types)) {
                $message = "Only JPG, JPEG, PNG files allowed!";
            } elseif ($file_size > 2 * 1024 * 1024) {
                $message = "Image size must be under 2MB!";
            } else {
                $photo = time() . "_" . basename($_FILES['photo']['name']);
                $target = "upload/" . $photo;
                move_uploaded_file($_FILES['photo']['tmp_name'], $target);
            }
        }

        if ($message == "") {

            /* 🔐 SECURE PIN */
            $generated_pin = random_int(100000, 999999);

            /* 🛡️ PREPARED STATEMENT */
            $stmt = $conn->prepare(
                "INSERT INTO vendor_info 
                (vendor_name, aadhaar_number, vendor_mobile, vendor_type, aadhaar_photo, pin, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())"
            );

            $stmt->bind_param(
                "ssssss",
                $name,
                $aadhaar,
                $mobile,
                $vendor_type,
                $photo,
                $generated_pin
            );

            if ($stmt->execute()) {
                $message = "Vendor Registration Successful!";

                /* ✅ STORE DETAILS FOR DISPLAY */
                $vendor_details = [
                    'name'        => $name,
                    'aadhaar'     => $aadhaar,
                    'mobile'      => $mobile,
                    'vendor_type' => $vendor_type,
                    'photo'       => $photo,
                    'pin'         => $generated_pin
                ];
            } else {
                $message = "Something went wrong. Try again!";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Vendor Registration</title>
<style>
body{font-family:Arial;background:#f0f2f5;text-align:center;padding-top:30px;}
.box{width:380px;margin:auto;background:white;padding:20px;border-radius:10px;}
input,select{width:90%;padding:10px;margin:10px;}
button{width:90%;padding:12px;background:#28a745;color:white;border:none;font-size:18px;}
.success{color:green;font-size:20px;margin-top:10px;}
.error{color:red;font-size:18px;margin-top:10px;}
.pin-box{background:#dfffd8;padding:15px;border-radius:8px;font-size:22px;margin-top:10px;}
.btn{display:inline-block;background:#007bff;color:white;padding:12px 20px;text-decoration:none;border-radius:8px;margin-top:10px;}
.logout{display:inline-block;background:#dc3545;color:white;padding:8px 14px;border-radius:6px;text-decoration:none;margin-bottom:10px;}
.details p{margin:6px 0;text-align:left;}
.details img{width:120px;border-radius:10px;border:1px solid #ccc;}
</style>
</head>

<body>

<a class="logout" href="security_logout.php">Logout</a>

<h2>Vendor Registration</h2>

<?php if ($vendor_details == null): ?>
<div class="box">
<form method="post" enctype="multipart/form-data">

    <input type="text" name="name" placeholder="Vendor Full Name" required>

    <input type="text" name="aadhaar" placeholder="Aadhaar Number (12 digits)"
           maxlength="12" pattern="[0-9]{12}" required>

    <input type="text" name="mobile" placeholder="Mobile Number (10 digits)"
           maxlength="10" pattern="[0-9]{10}" required>

    <select name="vendor_type" required>
        <option value="">Select Vendor Type</option>
        <option value="General">General</option>
        <option value="Security">Security</option>
        <option value="Cleaner">Cleaner</option>
        <option value="Supplier">Supplier</option>
    </select>

    <input type="file" name="photo" required>

    <button type="submit" name="register">Register</button>

</form>
</div>
<?php endif; ?>

<?php if ($vendor_details != null): ?>
<div class="box details">
    <div class="success">Vendor Registration Successful!</div>

    <div class="pin-box">
        Your PIN: <b><?= $vendor_details['pin']; ?></b>
    </div>

    <hr>

    <p><b>Vendor Name:</b> <?= $vendor_details['name']; ?></p>
    <p><b>Aadhaar Number:</b> <?= "XXXX-XXXX-" . substr($vendor_details['aadhaar'], -4); ?></p>
    <p><b>Mobile Number:</b> <?= $vendor_details['mobile']; ?></p>
    <p><b>Vendor Type:</b> <?= $vendor_details['vendor_type']; ?></p>

    <p><b>Vendor Photo:</b></p>
    <img src="upload/<?= $vendor_details['photo']; ?>">

    <br><br>
    <a class="btn" href="vendor_login.php">Go to Login</a>
</div>
<?php endif; ?>

<?php if($message != "" && $vendor_details == null): ?>
    <div class="error"><?= $message ?></div>
<?php endif; ?>

</body>
</html>
