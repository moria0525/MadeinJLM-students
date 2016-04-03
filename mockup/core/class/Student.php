<?php

    class Student extends User {
        public function __construct()
        {
            parent::__construct();

            /*
            //Add database credentials
			$this->config->database->host = 'localhost';
            $this->config->database->user = 'root';
            $this->config->database->password = '';
            $this->config->database->name = 'jlm'; //Database name
			*/
			
			$this->config->userTableName = 'student';
			
            // Start object construction
            $this->start();
        }
    }
?>
