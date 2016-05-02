<?php

class API_Admin extends API {
    public function index() {
        $admin = new Admin();
        $admin->start();
        return $admin;
    }
    public function Login() {

        
        $username = $_POST['Username'];
        $password = $_POST['Password'];
        if (isset($auto))
            $auto = $_POST['auto'];  //To remember user with a cookie for autologin
        else $auto = false;  //To remember user with a cookie for autologin

        $admin = new Admin();
        $admin->start();

        //Login with credentials
        $admin->login($username,$password,$auto);
        
        $return_arr = array();
        
        //not required, just an example usage of the built-in error reporting system
        if($admin->signed){
            $return_arr = ['status' => "success"];
        }else{
            //Display Errors
            $errors = array();
            foreach($admin->log->getErrors() as $err){
                $errors[] = "<b>Error:</b> {$err}";
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        
        return $return_arr;
    }
}