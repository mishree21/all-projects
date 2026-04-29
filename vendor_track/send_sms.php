<?php

$apiKey = "9f7eda77c494e94974ddb7ba3cfbfacd-05bd5714-fcd8-49d9-8d88-1d6ec03d3e7c";   // 🔐 Put your new API key here
$baseUrl = "https://grgv5e.api.infobip.com";  // Your base URL

$data = [
    "messages" => [
        [
            "from" => "InfoSMS",   // Sender name (approved in Infobip)
            "destinations" => [
                ["to" => "918160214130"]  // Receiver mobile number with country code
            ],
            "text" => "Hello! This is a test SMS from my PHP application."
        ]
    ]
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $baseUrl . "/sms/2/text/advanced");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: App $apiKey",
    "Content-Type: application/json",
    "Accept: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if(curl_errno($ch)) {
    echo "Error: " . curl_error($ch);
} else {
    echo "Response: " . $response;
}

curl_close($ch);

?>