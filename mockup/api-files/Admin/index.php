<?php

class API_Admin extends API {
    public function index() {
        $admin = new Admin();
        $admin->start();
        return $admin;
    }
    public function Login() {
        if (isset($_POST['Email']))
            $username = $_POST['Email'];
        else $username = '';
        
        if (isset($_POST['Password']))
            $password = $_POST['Password'];
        else $password = '';
        
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
	public function logOut() {
        
        $admin = new Admin();
        
        $admin->logout();
        return ['status' => "success"]; 
    }
	
	 public function resetPassword() {
        if (isset($_POST['Email']))
            $email = $_POST['Email'];
        else $email = '';
        
        $admin = new Admin();

        //Login with credentials
        if ($data = $admin->resetPassword($email)) {
			// send email to $data->Email whith the confirmation $data->Confirmation
			sendMail::send($data->Email, 'Reset your password','Hello ' . $user->first_name . ' please click on the link at the bottom to reset your password.<br>click <a href="http://job.madeinjlm.org/MadeinJLM-students/mockup/#admin-new-password/' . $data->Confirmation . '">here</a>');
			$return_arr = ['status' => "success"];
		} else {
            //Display Errors
            $errors = array();
            foreach($admin->log->getErrors() as $err){
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
        
        $admin = new Admin();
		
        //Login with credentials
        if ($data = $admin->newPassword($hash,$newPass)) {
			$return_arr = ['status' => "success",$newPass];
		} else {
            //Display Errors
            $errors = array();
            foreach($admin->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
		}
        
        return $return_arr;
    }
    public function changePassword() {
        $admin = new Admin();
        
        if ($data = $admin->update($_POST)) {
            $return_arr = ['status' => "success"];
        } else {
             $errors = array();
            foreach($admin->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        return $return_arr;

    }
	  public function update() {
        $admin = new Admin();
        
        if ($data = $admin->update($_POST)) {
            $return_arr = ['status' => "success"];
        } else {
             $errors = array();
            foreach($admin->log->getErrors() as $err){
                $errors[] = $err;
            }
            $return_arr =  ['status' => "error",'errors' => $errors];
        }
        return $return_arr;
    }
	
	
	
	
}