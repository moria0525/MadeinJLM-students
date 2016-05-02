<?php
class API_General extends API {
	public function index() {}
    public function GetCollege() {

    }
    public function GetDegree() {

    }
    public function GetLanguages() {

    }
    public function GetSkills() {
		$db = new DB_Action();
		$sql = 'SELECT * FROM skills ORDER BY id ASC';
		return $db->getQuery($sql);
    }
}