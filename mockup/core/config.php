<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();

include_once 'core/functions.php';// data base class

include_once 'core/class/API.php';

include_once 'core/class/sendMail.php';

include_once 'core/class/Collection.php';
include_once 'core/class/Cookie.php';
include_once 'core/class/DB.php';
include_once 'core/class/DB_Table.php';
include_once 'core/class/DB_Action.php';
// include_once 'core/class/DB_Action.php';
include_once 'core/class/Hash.php';
include_once 'core/class/LinkedCollection.php';
include_once 'core/class/Log.php';
include_once 'core/class/Session.php';

include_once 'core/class/UserBase.php';
include_once 'core/class/User.php';
include_once 'core/class/Student.php';
include_once 'core/class/Admin.php';

/*
include_once 'core/class/medoo.php';// data base class
include_once 'core/class/class.pageDisplay.php';// page display..
include_once 'core/class/class.admin_access.php';// users class
include_once 'core/class/class.MODULE.php';// perents class of all module
*/
