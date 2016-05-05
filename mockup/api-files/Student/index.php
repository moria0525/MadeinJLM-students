<?php
class API_Student extends API {
    public function index() {
        $student = new Student();
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
        $user = $student->table->getRow(array('Email' => $email));
        sendMail::send($user->Email, 'Activated your account', 'Hi, please click on the link at the bottom to activated your account.<br>click <a href="http://job.madeinjlm.org/MadeinJLM-students/mockup/API/Student/activated?c=' . $user->Confirmation . '">here</a>');
    }
    public function register() {
        
        $student = new Student();
        
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
        
        $return_arr = array();
        
        if ($student->activate($_GET['c'])) 
            $return_arr = ['status' => "success"];
        else {
            
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
        
        $student->logout();
        return ['status' => "success"];
        
    }
    public function resetPassword() {
        if (isset($_POST['Email']))
            $email = $_POST['Email'];
        else $email = '';
        
        $student = new Student();

        //Login with credentials
        if ($data = $student->resetPassword($email)) {
			// send email to $data->Email whith the confirmation $data->Confirmation
			sendMail::send($data->Email, 'Reset your password', 'Hi, please click on the link at the bottom to reset your password.<br>click <a href="http://job.madeinjlm.org/MadeinJLM-students/mockup/#new-password/' . $data->Confirmation . '">here</a>');
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
        if (isset($_POST['hash']))
            $hash = $_POST['hash'];
        else $hash = '';
        
        if (isset($_POST['newPass']))
            $newPass = $_POST['newPass'];
        else $newPass = '';
        
        $student = new Student();
		
        //Login with credentials
        if ($data = $student->newPassword($hash,$newPass)) {
			$return_arr = ['status' => "success",$newPass];
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
    public function changePassword() {
        $student = new Student();
        
        if ($data = $student->update($_POST)) {
            $return_arr = ['status' => "success"];
        } else {
             $errors = array();
            foreach($student->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        return $return_arr;

    }
    public function changeStatus()
    {
	
    }
    public function changeProfileImage() {

    }
    public function update() {

    }
    public function managementTableInfo() {

    }
    public function deleteTableInfo() {

    }
    public function uploadProfile() {
		$student = new Student();
		
		if($student->isSigned()){
			
			if ($data = $student->uploadProfile($_POST['picture'])) {
				$return_arr = ['status' => "success"];
			} else {
				$errors = array();
				foreach($student->log->getErrors() as $err){
					$errors[] = $err;
				}
				$return_arr =  ['status' => "error",'errors' => $errors];
			}
        }else{
            //Display Errors
			$errors = array('User not connected');
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        
        return $return_arr;
		
    }
}
