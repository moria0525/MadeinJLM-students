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
    public function profileEditFormat() {
		$pageFormat = array(
				'basic_education_years' => array(
						'title' => 'Basic education years',
						'directive' => 'profileSelect',
						'data' => array(
								'option' => array(
										'0' => '12',
										'1' => '13',
										'2' => '14'
									),
							),
						'multy' => '0',
					),
				'basic_education_subject' => array(
						'title' => 'Basic education subject',
						'directive' => 'profileText',
						'data' => array(),
						'multy' => '0',
					),
			);
		return $pageFormat;
    }
}