<?php
header('Content-Type: application/json');
include_once('core/config.php');

$api_answer = array();

if (isset($_GET['api']) && file_exists('api-files/' . trim($_GET['api']) . '/index.php')) {
    $apiName = trim($_GET['api']);
    
    include_once 'api-files/' . $apiName . '/index.php';
    
    $apiClass = 'API_' . $apiName;
    $apiPage = new $apiClass();

    if (isset($_GET['fname']) && $_GET['fname'] != 'index' && $_GET['fname'] != 'index.php' && method_exists($apiPage, trim($_GET['fname'])))
        $funcName = trim($_GET['fname']);
    else $funcName = 'index';

    $api_answer = $apiPage->$funcName();
}

echo json_encode($api_answer);
