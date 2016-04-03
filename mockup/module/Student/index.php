<?php
/**
 * Created by PhpStorm.
 * User: Barak
 * Date: 19/03/15
 * Time: 00:37
 */

class MODULE_UserNotConnected extends MODULE {
    public function index() {
        $user = new client();
        $user->loginUser();
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function Login() {

        $user = new client();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function Register() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function ResetPassword() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function NewPassword() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function ChangePassword() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function ChangeStatus() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function ChangeProfileImage() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function Update() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function ManagementTableInfo() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    public function deleteTableInfo() {

        $user = new student();
        $user->loginUser('barak','089702133');
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
    
/*
    public function newUser() {

        $user = new manger();
        $user->newUser(array('password'=>'089702133','name' => 'Barak Turgeman','username'=> 'barak','class'=> 'developer', 'email' => 'barak@thinksmart.co.il'));
        print_r($user);
        $page = new pageDisplay('smarty');
        $page->set_tpl('login.tpl');
        return $page;
    }
*/
}