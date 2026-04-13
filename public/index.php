<?php
// Dynamic SEO for Social Media crawlers
$title = "إيثريوم العرب - Ethereum Arabia Academy";
$description = "المنصة العربية الأولى لتعلم أمن إيثريوم والخصوصية الرقمية باللغة العربية. دروس تفاعلية، ألعاب أمان، وأكاديمية متخصصة.";
$image = "https://academy.ethereum-arabia.xyz/logo.png";
$url = "https://academy.ethereum-arabia.xyz" . $_SERVER['REQUEST_URI'];
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title><?php echo $title; ?></title>
    <meta name="description" content="<?php echo $description; ?>">
    <meta property="og:title" content="<?php echo $title; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $image; ?>">
    <meta property="og:url" content="<?php echo $url; ?>">
    <meta name="twitter:card" content="summary_large_image">
</head>
<body>
    <?php 
    if (file_exists("index.html")) {
        readfile("index.html"); 
    } else {
        echo "Loading Academy...";
    }
    ?>
</body>
</html>