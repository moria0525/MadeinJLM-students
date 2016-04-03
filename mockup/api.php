<?php
header('Content-Type: application/json');

include_once('core/config.php');

$api_answer = array();

if (isset($_GET['module']) && file_exists('module/' . trim($_GET['module']) . '/index.php')) {
    $moduleName = trim($_GET['module']);
    include_once 'module/' . $moduleName . '/index.php';
    
    $moduleClass = 'MODULE_' . $moduleName;
    $modulePage = new $moduleClass();

    if (isset($_GET['fname']) && $_GET['fname'] != 'index' && $_GET['fname'] != 'index.php' && method_exists($modulePage, trim($_GET['fname'])))
        $funcName = trim($_GET['fname']);
    else $funcName = 'index';

    $api_answer = $modulePage->$funcName();
    
}

echo json_encode($api_answer);
