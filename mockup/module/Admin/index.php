<?php
/**
 * Created by PhpStorm.
 * User: Barak
 * Date: 19/03/15
 * Time: 00:37
 */

class MODULE_SignUp extends MODULE {
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