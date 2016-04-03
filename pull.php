<html style="background: #101241;">
    <body>
    <?php
    $output = shell_exec('git pull origin master');
    echo "<pre style=\"width: 570px;margin: 90px auto;color: #FFF;font-size: 20px;\">$output</pre>";
    ?>
    </body>
</html>