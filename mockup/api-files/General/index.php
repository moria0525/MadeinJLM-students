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
    
    
    public function profileEditFormat() {
		header('Content-Type: text/html; charset=utf-8');
		$pageFormat = array(
				'basic_education_subject' => array(
						'title' => 'Basic education subject',
						'directive' => 'profileEditText',
						'data' => array(),
						'multy' => 0,
					),
				'basic_education_years' => array(
						'title' => 'Basic education years',
						'directive' => 'profileEditSelect',
						'data' => array(
								'option' => array(
										'0' => '12',
										'1' => '13',
										'2' => '14'
									),
							),
						'multy' => 0,
					),
				'skils' => array(
						'title' => 'Skils',
						'directive' => 'profileEditSelect',
						'data' => array(
								'option' => array(
										'0' => '12',
										'1' => '13',
										'2' => '14'
									),
							),
						'multy' => 1,
					),
			);
		
		$temp_render = '
			<ul class="profileEditFormat">';
		
		foreach ($pageFormat as $item) {
			$temp_render .= '
                <li class="row">
					<label class="col-sm-4 profileItemLable" ng-click="showEditZone()" tooltip-placement="top-right" uib-tooltip="Edit">{{ title }}:</label>
					<div class="col-sm-8">
						<div class="no-edit-zone" ng-click="showEditZone()" ng-show="!editZoneShow" tooltip-placement="top-left" uib-tooltip="Edit">
							{{value}}&nbsp;
						</div>
						<div class="edit-zone" ng-show="editZoneShow">';
			if ($item['multy'] == 0) {
				$temp_render .= '
							<div class="input-group">
								<input type="text" class="form-control" " ng-model="editValue">
								<div class="input-group-btn">
									<button type="button" class="btn btn-success" ng-click="editZoneSave()" ng-disabled="value == editValue">Save</button>
									<button type="button" class="btn btn-warning" ng-click="editZoneReset()" ng-disabled="value == editValue">Reset</button>
									<button type="button" class="btn btn-default" ng-click="editZoneClose()">Cancel</button>
								</div>
							</div>';
			} else {
				$temp_render .= '
							<div class="input-group" ng-repeat="(key, valueValue) in editValue">
								<div class="input-group">
									<input type="text" class="form-control" " ng-model="editValue">
									<div class="input-group-btn">
										<button type="button" class="btn btn-success" ng-click="editZoneSave()" ng-disabled="value == editValue">Save</button>
										<button type="button" class="btn btn-warning" ng-click="editZoneReset()" ng-disabled="value == editValue">Reset</button>
										<button type="button" ng-show="multy == 1" class="btn btn-danger" ng-click="editZoneRemove()">Remove</button>
										<button type="button" class="btn btn-default" ng-click="editZoneClose()">Cancel</button>
									</div>
								</div>
							</div>
							<button type="button" class="btn btn-link" ng-click="editZoneClose()"><i class="fa fa-plus"></i> Add</button>';
			}
			$temp_render .= '
						</div>
					</div>
				</li>';
		}
		$temp_render .= '
			</ul>';

		echo $temp_render;
		die();
    }
}