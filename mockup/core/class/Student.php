<?php
/**
 *
 * Student Class
 * All functions was written for student, with extending of the User class
 * Deals with every thing the student needs to do in his profile
 *
 */
class Student extends User {
	
    public function __construct() //constructor
	{
		parent::__construct();
		$this->config->userTableName = 'student';
		// Start object construction
		$this->start();
	}
    
    public function userData() //get user data
    {
		// header('Content-Type: text/html; charset=utf-8');
        if ((bool) $this->session->signed) {
			$db_action = new DB_Action();
			// get student skills
			$sql = 'SELECT student_skills.id,student_skills.skill_id,student_skills.years,skills.name
					FROM student_skills INNER JOIN skills ON student_skills.skill_id=skills.id
					WHERE student_id=' . $this->_data['ID'] . ' ORDER BY id ASC';
			$this->_data['skils'] = $db_action->getQuery($sql);
            // print_r($this->_data);
			return $this->_data;
        }
        return false;
    }
    
    
    /*
     * Upload profile picture function
     * @param $profile for id
     * bool function
     * return true in success
     */
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
    
    public function deleteCV() { //to delete a cv
		
		if ($this->_data['cv'] == '')
			return true;
		
		define('UPLOAD_DIR', 'uploads/cv/');
		
		if (file_exists ( UPLOAD_DIR . $this->_data['cv'] ))
			unlink( UPLOAD_DIR . $this->_data['cv'] );
		
		$data = array();
		$data['id'] = $this->ID;
		$data['cv'] = '';
		
		$sql = "UPDATE _table_ SET cv=:cv WHERE ID=:id";

		if ($this->table->runQuery($sql, $data)) {
			$this->log->report('Information Updated');

			if ($this->clone === 0) {
				$this->session->update = true;
			}
			
			$this->_data = array_merge($this->_data, $data);
			
			$this->_updates = new Collection();
			
		} else {
			$this->log->error(2);
			return false;
		}
	}
    
    public function uploadCV($cv) //upload a cv, shuld get the cv file
	{
        $this->log->channel('update CV picture');
		
		if (empty($cv))
            $this->log->error(2);
		
		$file_name = $cv['name'];
		$file_size =$cv['size'];
		$file_tmp =$cv['tmp_name'];
		$file_type=$cv['type'];   
		$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
		
		$extensions = array("jpeg","jpg","png","pdf","doc","dot","docx");        
		if(in_array($file_ext,$extensions )=== false)
			 $this->log->error("File extension not allowed, please choose a JPEG or PNG or PDF or DOC file.");
		
		if($file_size > 5*1024*1024)
			 $this->log->error("File size cannot exceed 5 MB");
		
        if ($this->log->hasError()) {
            return false;
        }
		
		define('UPLOAD_DIR', 'uploads/cv/');
		
		if ($this->_data['cv'] != '' && file_exists ( UPLOAD_DIR . $this->_data['cv'] ))
			unlink( UPLOAD_DIR . $this->_data['cv'] );
		
		$cv_location = UPLOAD_DIR . $this->ID . '.' . $file_ext;
		move_uploaded_file($file_tmp,$cv_location);
		
		$this->log->report('upload CV complete');
		
		if ($this->_data['cv'] != $this->ID . '.' . $file_ext) {
			$data = array();
			$data['id'] = $this->ID;
			$data['cv'] = $this->ID . '.' . $file_ext;
			
			$sql = "UPDATE _table_ SET cv=:cv WHERE ID=:id";

			if ($this->table->runQuery($sql, $data)) {
				$this->log->report('Information Updated');

				if ($this->clone === 0) {
					$this->session->update = true;
				}
				
				$this->_data = array_merge($this->_data, $data);
				
				$this->_updates = new Collection();

			} else {
				$this->log->error(2);
				return false;
			}
		}
		return $this->_data['cv'];
	}
	
    
    /*
     * Change user's status function
     * @param $info array with data on user
     * bool function
     * return true in success
     */
    
    public function changeStatus($info) //change user's status from looking for a job to not looking
    { 
		// checking if get all info we need
		if (!isset($info['status']) || 
			($info['status'] == 0 && 
				(!isset($info['reason']) || 
				($info['reason'] == 9 && 
					(!isset($info['description']) || 
					trim($info['description']) == ''))))) {
			$this->log->error(2);
			return false;
		}
		// checking if status is change
		if ($this->status == $info['status']) {
			$this->log->error(2);
			return false;
		}
		$data = array('id' => $this->ID, 'status' => $info['status']);

		$sql = "UPDATE _table_ SET status=:status  WHERE ID=:id";
		
		if ($this->table->runQuery($sql, $data)) {
            
			$this->log->report('Information Updated(ChangeStatus)');
			
            if ($this->clone === 0) {
                $this->session->update = true;
            }

            // Update the current object with the updated information
            $this->_data = array_merge($this->_data, $data);

            // Clear the updates stack
            $this->_updates = new Collection();
			
			if ($info['status'] == 0) {
				$data = array(
						'student_id' => $this->_data['ID'],
						'reason' => $info['reason']
					);
				if (isset($info['description'])) {
					$data['description'] = $info['description'];
				}
				$into = array();
				foreach ($data as $index => $val) {
					$into[] = $index;
				}

				$intoStr = implode(', ', $into);
				$values = ':' . implode(', :', $into);

				$sql = "INSERT INTO student_turn_off ({$intoStr}) VALUES({$values})";
				
				$db_action = new DB_Action();
				
				if ($db_action->runQuery($sql, $data)) {
					$this->log->report('Information Updated(ChangeStatus)');
				} else {
					$this->log->error(2);
					return false;
				}
			}
        } else {
            $this->log->error(2);
            return false;
        }
		return true;
	}
	
    /*
     * Check skills function
     * Checks if the skill entered exists on database
     * If skill doesn't exist - it adds it
     * @param $skill_name
     * bool function
     * return true in success
     */
    
    
    private function checkSkillExist($skill_name) 
    {
		$skill_name = strtolower($skill_name); //the name of the skill, in simple
		$db_action = new DB_Action();
        $sql = 'SELECT id FROM skills WHERE LOWER(name)=:name LIMIT 1';
        if (!$stmt = $db_action->getStatement($sql, array('name' => $skill_name))) {
            return false;
        } else {
			$temp = $stmt->fetch();
			if (isset($temp['id']))
				return $temp['id'];
			else return false;
        }
	}
	
    public function addSkill($info)  //add a skill to user
    {
		if (!isset($info['name']) || !isset($info['years'])) {
			$this->log->error(2);
			return false;
		}
		$db_action = new DB_Action();
		if (isset($info['id']) && $info['id'] != 0) {
			// update Skill
			$skillBefore = $db_action->getRow('student_skills', array('id' => $info['id']));
			if (!$skillBefore) {
				$this->log->error(2);
				return false;
			}
			$dataTemp = array();
			$dataTemp['skill_id'] = $this->checkSkillExist($info['name']);
			$dataTemp['years'] = intval($info['years']);
			if (!$dataTemp['skill_id']) {
				// add new skill
				$sql = "INSERT INTO skills (name) VALUES(:name)";
				
				if ($db_action->runQuery($sql, array('name' => $info['name']))) {
					$this->log->report('Information Updated(addSkill)');
					$dataTemp['skill_id'] = $db_action->getLastInsertedID();
				} else {
					$this->log->error(2);
					return false;
				}
			}
			$data = array();
			$into = array();
			foreach ($dataTemp as $k => $v) {
				if ($v != $skillBefore[$k]) {
					$data[$k] = $v;
					$into[] = $k . '=:' . $k;
				}
			}
			if (isset($data['skill_id']) && $db_action->getRow('student_skills', array('skill_id' => $data['skill_id'],'student_id'=>$this->_data['ID']))) {
				$this->log->error('You already got this skill');
				return false;
			}
			if (!empty($data)) {
				$data['id'] = intval($info['id']);
				$sql = "UPDATE student_skills SET ".implode(', ', $into)." WHERE id=:id";
				if ($db_action->runQuery($sql, $data)) {
					
					$this->log->report('Information Updated(addSkill)');
					if ($this->clone === 0) {
						$this->session->update = true;
					}
				} else {
					$this->log->error(2);
					return false;
				}
			}
		} else {
			// add Skill
			$data = array();
			$data['skill_id'] = $this->checkSkillExist($info['name']);
			$data['years'] = intval($info['years']);
			if ($data['skill_id'] && $db_action->getRow('student_skills', array('skill_id' => $data['skill_id'],'student_id'=>$this->_data['ID']))) {
				$this->log->error('You already got this skill');
				return false;
			}
			if (!$data['skill_id']) {
				// add new skill
				$sql = "INSERT INTO skills (name) VALUES(:name)"; //this is the sql query
				
				if ($db_action->runQuery($sql, array('name' => $info['name']))) {
					$this->log->report('Information Updated(addSkill)');
					$data['skill_id'] = $db_action->getLastInsertedID();
				} else {
					$this->log->error(2);
					return false;
				}
			}
			$data['student_id'] = $this->_data['ID'];
			$into = array();
			foreach ($data as $k => $v) {
				$into[] = $k;
			}
			
			$intoStr = implode(', ', $into);
			$values = ':' . implode(', :', $into);
			
			$sql = "INSERT INTO student_skills ({$intoStr}) VALUES({$values})"; //this is the sql query
			
			if ($db_action->runQuery($sql, $data)) {
				$this->log->report('Information Updated(addSkill)');
				if ($this->clone === 0) {
					$this->session->update = true;
				}
			} else {
				$this->log->error(2);
				return false;
			}
		}
		if (isset($data)) {
			$data['id'] = $db_action->getLastInsertedID();
			if ($data['id'] == 0 && isset($info['id']) && $info['id'] != 0) 
				$data['id'] = $info['id'];
			return $data;
		}
		return true;
	}
	
    
    /*
     * Delete skill function
     * Delete a certain skill to a certain user, not from the general db
     * @param $id for skill's id
     * bool function
     * return true in success
     */
    
    
    public function deleteSkill($id) //delete a skill to a user, not from db general
    {
		$sql = 'DELETE FROM student_skills WHERE id='.$id.' AND student_id='.$this->_data['ID']; //this is the sql query
		$db_action = new DB_Action();
		
		if ($db_action->query($sql)){
			if ($this->clone === 0) {
				$this->session->update = true;
			}
			return true;
		} else {
			$this->log->error(2);
			return false;
		}
	}
}
?>
