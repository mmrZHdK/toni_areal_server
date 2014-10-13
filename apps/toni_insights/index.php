<?php

/*
define('BASE_PATH', __DIR__);
define('BASE_URL', 'http://data.zhdk.ch/apps/toni_insights/');
*/

/**
 * @param  string  $filename
 * @return string
 */
function asset_path($filename) {
    $manifest_path = './app/build/css/temp/rev-manifest.json';

    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), TRUE);
    } else {
        $manifest = [];
    }

    if (array_key_exists($filename, $manifest)) {
        return $manifest[$filename];
    }

    return $filename;
}

?>

<!doctype html>
<html class="no-js">
<head>
    <!-- TODO: find betters solution -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />


    <meta charset="utf-8">
    <title>Insights</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

    <link rel="stylesheet" href="./app/build/css/temp/<?php echo asset_path('main.css'); ?>">

    <script src="//use.typekit.net/jmq6ukp.js"></script>
    <script>try{Typekit.load();}catch(e){}</script>

</head>
<body>
    <div id="app-container"></div>
    <script src="./app/build/js/app.js"></script>
</body>
</html>
