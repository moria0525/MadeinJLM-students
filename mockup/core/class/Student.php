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
        $sql = "UPDATE _table_ SET profile=:profile  WHERE ID=:id";

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
}
?>
