<?php

    class Admin extends User {
        public function __construct()
        {
        	parent::__construct();
			$this->config->userTableName = 'admin';
        	// Start object construction
			$this->start();
        }
    }
?>
