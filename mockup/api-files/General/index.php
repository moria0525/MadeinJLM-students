<?php
class API_General extends API {
	public function index() {}
    
    
    public function GetCollege() {
        $db = new DB_Action();
		$sql = 'SELECT * FROM college ORDER BY id ASC';
		return $db->getQuery($sql);
    }
    public function GetDegree() {
        $db = new DB_Action();
		$sql = 'SELECT * FROM degree ORDER BY id ASC';
		return $db->getQuery($sql);
    }
    public function GetLanguages() {
        $db = new DB_Action();
		$sql = 'SELECT * FROM languages ORDER BY id ASC';
		return $db->getQuery($sql);
    }
    public function GetSkills() {
		$db = new DB_Action();
		$sql = 'SELECT * FROM skills ORDER BY id ASC';
		return $db->getQuery($sql);
    }
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