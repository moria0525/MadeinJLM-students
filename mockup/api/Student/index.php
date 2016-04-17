<?php
class API_Student extends API {
    public function index() {
        $student = new Student();
        $student->start();
        return $student->userData();
    }
    public function login() {
        
        if (isset($_POST['Email']))
            $username = $_POST['Email'];
        else $username = '';
        
        if (isset($_POST['Password']))
            $password = $_POST['Password'];
        else $password = '';
        
        if (isset($_POST['auto']))
            $auto = $_POST['auto'];  //To remember user with a cookie for autologin
        else $auto = false;  //To remember user with a cookie for autologin

        $student = new Student();
        $student->start();

        //Login with credentials
        $student->login($username,$password,$auto);
        
        $return_arr = array();
        
        //not required, just an example usage of the built-in error reporting system
        if($student->isSigned()){
            $return_arr = ['status' => "success"];
        }else{
            //Display Errors
            $errors = array();
            foreach($student->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        
        return $return_arr;
    }
    public function sendActivated($email) {
        $student = new Student();
        $student->start();
        $user = $student->table->getRow(array('Email' => $email));
        sendMail::send($user->Email, 'Activated your account', 'Hi, please click on the link at the bottom to activated your account.<br>click <a href="http://www.baraktech.co.il/API/Student/activated?c=' . $user->Confirmation . '">here</a>');
    }
    public function register() {
        
        $student = new Student();
        $student->start();
        
        $return_arr = array();
        
        $input = new Collection($_POST);

        $registered = $student->register(array(
                'Email'     => $input->email,
                'Password'  => $input->passsword,
                'Password2' => $input->passsword2,
                'first_name'  => $input->first_name,
                'last_name'  => $input->last_name,
            ),true);

        if($registered){
			$this->sendActivated($input->email);
            $return_arr = ['status' => "success"];
        }else{
            //Display Errors
            $errors = array();
            foreach($student->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        
        return $return_arr;
    }
    public function activated() {
        
        $student = new Student();
        $student->start();
        
        $return_arr = array();
        
        if ($student->activate($_GET['c'])) 
            $return_arr = ['status' => "success"];
        else {
            print_r($student->log->getAllReports());
            //Display Errors
            $errors = array();
            foreach($student->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
            
        } 
        
        return $return_arr;
    }
    public function logOut() {
        
        $student = new Student();
        $student->start();
        
        $student->logout();
        return ['status' => "success"];
        
    }
    public function resetPassword() {
        if (isset($_POST['Email']))
            $email = $_POST['Email'];
        else $email = '';
        
        $student = new Student();
        $student->start();

        //Login with credentials
        if ($data = $student->resetPassword($email)) {
			// send email to $data->Email whith the confirmation $data->Confirmation
			$return_arr = ['status' => "success"];
		} else {
            //Display Errors
            $errors = array();
            foreach($student->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
		}
        
        return $return_arr;
    }
    public function newPassword() {

    }
    public function changePassword() {
        echo "hello 2";
                       $_SESSION["userId"] = "24";
        $conn = mysql_connect("localhost","root","");
        mysql_select_db("phppot_examples",$conn);
        if(count($_POST)>0) {
        $result = mysql_query("SELECT *from users WHERE userId='" . $_SESSION["userId"] . "'");
        $row=mysql_fetch_array($result);
        if($_POST["currentPassword"] == $row["password"]) {
        mysql_query("UPDATE users set password='" . $_POST["newPassword"] . "' WHERE userId='" . $_SESSION["userId"] . "'");
        $message = "Password Changed";
        } else $message = "Current Password is not correct";
        }
    }
    public function changeStatus() {

    }
    public function changeProfileImage() {

    }
    public function update() {

    }
    public function managementTableInfo() {

    }
    public function deleteTableInfo() {

    }
}