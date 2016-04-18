<?php

    class Student extends User {
        public function __construct()
        {
        	parent::__construct();
		$this->config->userTableName = 'student';
			
        	// Start object construction
            	$this->start();
        }
    }
?>
