<?php

class Student extends User {
	public function __construct()
	{
		parent::__construct();
		$this->config->userTableName = 'student';
		// Start object construction
		$this->start();
	}
    public function userData()
    {
        if ((bool) $this->session->signed) {
			$this->_data['skils'] = array('hi1','hi2','hi3');
            return $this->_data;
        }
        return false;
    }
    public function uploadProfile($profile)
	{
        $this->log->channel('update profile picture');
		
		if (empty($profile))
            $this->log->error(2);
		
		if (strpos($profile, 'data:image/jpeg;base64,') === false)
            $this->log->error('Profile picture must be jpeg');
		
        //Check for errors
        if ($this->log->hasError()) {
            return false;
        }
		
		define('UPLOAD_DIR', 'uploads/profiles/');
		$base64img = str_replace('data:image/jpeg;base64,', '', $profile);
		$profile = base64_decode($base64img);
		$profile_location = UPLOAD_DIR . $this->ID . '.jpg';
		file_put_contents($profile_location, $profile);
		
		$this->log->report('upload profile complete');

        //Prepare Info for SQL Insertion
        $data = array();
        $data['id'] = $this->ID;
        $data['profile'] = UPLOAD_DIR . $this->ID . '.jpg?' .time();
		
        //Prepare User Update Query
        $sql = "UPDATE _table_ SET profile=:profile WHERE ID=:id";

        //Check for Changes
        if ($this->table->runQuery($sql, $data)) {
            $this->log->report('Information Updated');

            if ($this->clone === 0) {
                $this->session->update = true;
            }

            // Update the current object with the updated information
            $this->_data = array_merge($this->_data, $data);

            // Clear the updates stack
            $this->_updates = new Collection();

            return true;
        } else {
            $this->log->error(2);
            return false;
        }
	}
     public function changeStatus($new_status, $reason, $desc) {
         
         $new = new DB_Action();
//         echo $new;
         echo $this->_data['status'];
         if ($new_status === $this->_data['status']) {
             // צריך לשלוח הודעת שגיאה בלוג לא?
             return false;
         } else { // אם עשיתה return למה יש פה else?
              $data = array();
             $data['id'] = $this->ID;
             $data['status'] = $new_status;
             
             //*****need to cheak old status against the new status******
             //SELECT status FROM student WHERE ID=30 LIMIT 1
             //    public function getRow($table, $arguments)
             //             $temp = $this->table->getRow($this->table, $this->ID);
             //             echo $temp;
             //             
             //              if ($temp->status == $new) {
             //              }
             //**********************************************************
            // _table_ - זה אוטומטית מחליף לטבלה הראשית של הסטודנט
             $sql = "UPDATE _table_ SET status=:status  WHERE ID=:id";
         }
          if ($this->table->runQuery($sql, $data)) {
            $this->log->report('Information Updated(ChangeStatus)');
			// יפה זה חשוב - זה בעצם דואג לעדכן את הסשיין! כל הכבוד שעליתם על זה לבד
            if ($this->clone === 0) {
                $this->session->update = true;
            }

            // Update the current object with the updated information
            $this->_data = array_merge($this->_data, $data);

            // Clear the updates stack
            $this->_updates = new Collection();
			// אני רואה שעדין לא הוספתם לטבלה ששומרת את הסיבה לעזיבה
			// ובכלל לא השתמשתם ב DB_Action
            return true;
        } else {
            $this->log->error(18);
            return false;
        }
         
     }
}
?>
