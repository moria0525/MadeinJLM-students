<?php

    class Student extends User {
        
        //when change the status activation button reason
        protected $statusReasonList = array(

        1  => 'Found job thanks to this site',
  
        2  => 'Found job not from this site',
       
        3  => 'other',

    );
        
        public function __construct()
        {
        	parent::__construct();
			$this->config->userTableName = 'student';
        	// Start object construction
			$this->start();
        }
        
        public function changeStatus($reason = null, $typeReason = null) {
            
            $data = array(
                'id'           => $uid,
                'status'         => $status
            );
            
            
               if ($this->table->runQuery($sql, $data)) {
                $this->log->report('Status has been changed');
                return true;
            }
            else {
                $this->log->error(18);
                return false;
            }
        }
    }
?>
