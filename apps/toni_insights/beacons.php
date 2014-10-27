<!DOCTYPE html>
<html class="no-js">
<head>
    <!-- TODO: find betters solution -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />


    <meta charset="utf-8">
    <title>Insights</title>
    <meta name="description" content="">
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, minimal-ui" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="mobile-web-app-capable" content="yes">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

    <script src="./app/assets/js/vendor/jquery.js"></script>
    <script src="scripts.js?<?php echo time(); ?>"></script>


    <style>
        body {
            font-family: Arial;
            padding: 20px;
        }
        ul {
            list-style: none;
        }
        #debugDiv {
            margin: 20px;
        }
    </style>
</head>
<body>
    <a href="http://insights.lukasgaechter.ch/beacons.php?<?php echo time(); ?>">Neu laden</a>
    <br><br>
    <div id="debugDiv"></div>
</body>
</html>
