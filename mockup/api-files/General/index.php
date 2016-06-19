<?php

/**
  *This one is about sql queries, the most common
  *API_General
  **/

class API_General extends API {
	public function index() {}
    
    //SQL query for all college
    public function GetCollege() {
        $db = new DB_Action();
		$sql = 'SELECT * FROM college ORDER BY id ASC';
		return $db->getQuery($sql);
    }
    
    //SQL query for all degrees
    public function GetDegree() {
        $db = new DB_Action();
		$sql = 'SELECT * FROM degree ORDER BY id ASC';
		return $db->getQuery($sql);
    }
    
    //SQL query for all languages
    public function GetLanguages() {
        $db = new DB_Action();
		$sql = 'SELECT * FROM languages ORDER BY id ASC';
		return $db->getQuery($sql);
    }

    //SQL query for all skills
    public function GetSkills() {
		$db = new DB_Action();
		$sql = 'SELECT * FROM skills ORDER BY id ASC';
		return $db->getQuery($sql);
    }
   
    //SQL query for all options when there is selection of skills, degrees etc
    public function getOptions() {
		$return_array = array();
		$db = new DB_Action();
		
		$sql = 'SELECT * FROM skills WHERE status=1 ORDER BY id ASC';
		$temp = $db->getQuery($sql);
		if ($temp && is_array($temp) && !empty($temp))
			foreach ($temp as $v)
				$return_array['skils'][] = $v['name'];
		
		$sql = 'SELECT * FROM degree ORDER BY id ASC';
		$temp = $db->getQuery($sql);
		if ($temp && is_array($temp) && !empty($temp)) {
			foreach ($temp as $v)
				$return_array['degrees'][$v['id']] = $v['name'];
		}
		
		$sql = 'SELECT * FROM languages ORDER BY id ASC';
		$temp = $db->getQuery($sql);
		if ($temp && is_array($temp) && !empty($temp))
			foreach ($temp as $v)
				$return_array['languages'][$v['id']] = $v['name'];
		
		$sql = 'SELECT * FROM college ORDER BY id ASC';
		$temp = $db->getQuery($sql);
		if ($temp && is_array($temp) && !empty($temp))
			foreach ($temp as $v)
				$return_array['colleges'][$v['id']] = $v['name'];
		
		return $return_array;
    }
    
}