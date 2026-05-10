<?php
if(isset($_POST['send_sms'])) {
    $time = date("h:i A");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vendor Track Notifier</title>

    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
        }

        /* Navbar */
        .navbar {
            background-color: #e6e6e6;
            padding: 15px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar a {
            margin-left: 25px;
            text-decoration: none;
            color: #1f3c88;
            font-size: 18px;
            font-weight: bold;
        }

        .navbar a:hover {
            color: green;
        }

        /* Main Container */
        .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 60px 80px;
        }

        .left {
            width: 55%;
        }

        .title {
            font-size: 48px;
            font-weight: bold;
            color: #002060;
        }

        .subtitle {
            color: #2e4a3b;
            font-size: 20px;
            margin-top: 20px;
            line-height: 1.5;
        }

        /* Button Group */
        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 40px;
        }

        .btn {
            display: inline-block;
            padding: 14px 28px;
            background: #00a651;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 17px;
            border: none;
            cursor: pointer;
            white-space: nowrap;   /* Prevent text break */
            transition: 0.3s ease;
        }

        .btn:hover {
            background: #008c46;
            transform: translateY(-2px);
        }

        .right img {
            width: 420px;
            max-width: 100%;
        }

        /* Responsive */
        @media (max-width: 900px) {
            .container {
                flex-direction: column;
                text-align: center;
            }

            .left {
                width: 100%;
            }

            .button-group {
                justify-content: center;
            }

            .right {
                margin-top: 40px;
            }
        }
    </style>
</head>

<body>

<div class="navbar">
    <img src="image copy.png" width="60">
    <div>
        <a href="index.php">Home</a>
        <a href="about.php">About us</a>
        <a href="contact.php">Contact</a>
    </div>
</div>

<div class="container">
    <div class="left">
        <div class="title">Welcome to<br>Vendor Track Notifier</div>

        <div class="subtitle">
            A secure Web-based System to manage vendor entry 
            in residential societies
        </div>

        <!-- Buttons -->
        <div class="button-group">

            <form method="POST">
                <button type="submit" name="send_sms" class="btn">
                    Simulate SMS Alert
                </button>
            </form>

            <a class="btn" href="vendor_registration.php">Register Vendor</a>
            <a class="btn" href="security_login.php">Login as Security</a>
            <a class="btn" href="admin_login.php">Admin Panel</a>

        </div>
    </div>

    <div class="right">
        <img src="image.png">
    </div>
</div>

<?php
if(isset($_POST['send_sms'])) {
    echo "
    <script>
    Swal.fire({
        title: 'SMS Sent Successfully!',
        text: 'Vendor entry alert sent at $time',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    </script>
    ";
}
?>

</body>
</html>