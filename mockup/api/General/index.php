<?php
class API_General extends API {
    protected $db;
	protected $config = array(
        'database'        => array(
            'host'     => 'localhost',
            'name'     => 'jobmadei_db',
            'user'     => 'jobmadei_user',
            'password' => 'q1w2e3r4',
            'dsn'      => '',
            'pdo'      => null,
        )
    );
	public function index() {}
    public function GetCollege() {

    }
    public function GetDegree() {

    }
    public function GetLanguages() {

    }
    public function GetSkills() {
		$this->start_db();
		$sql = 'SELECT * FROM  `skills` ';
		print_r($this->db->getStatement($sql));
		echo 'hi';
		die();
    }
	
	
	
	protected function start_db() {
        if (!($this->db instanceof DB)) {
            // Instantiate the Database object
            if ($this->config->database->pdo instanceof \PDO) {
                // Uses an existing PDO connection
                $this->db = new DB($this->config->database->pdo);
            } else {
                if ($this->config->database->dsn) {
                    $this->db = new DB($this->config->database->dsn);
                } else {
                    $this->db = new DB($this->config->database->host, $this->config->database->name);
                }

                // Configure the database object
                $this->db->setUser($this->config->database->user);
                $this->db->setPassword($this->config->database->password);
            }
        }
	}
}