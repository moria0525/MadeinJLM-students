<?php

/**
 * Database Connection Manager
 *
 * @package ptejada\uFlex
 * @author  Pablo Tejada <pablo@ptejada.com>
 */
class DB
{
    /** @var  Log - Log errors and report */
    public $log;
    /** @var string - The server IP or host name */
    private $host = 'localhost';
    /** @var string - The server user to login as */
    private $user = 'jobmadei_user';
    /** @var string - The user password */
    private $password = 'q1w2e3r4';
    /** @var string - The name of the database */
    private $dbName = 'jobmadei_db';
    /** @var string - Alternative DSN string */
    private $dsn = '';
    /** @var \PDO - The DB connection session */
    private $connection;

    /**
     * Initializes the Database object
     *
     * @param string $hostOrDSN|\PDO - The domain/IP of the DB, the PDO DSN string or PDO connection
     * @param string $dbName    - The name of the database
     */
    public function __construct($hostOrDSN = '', $dbName = '')
    {
        if (!$dbName) {
            if ($hostOrDSN instanceof \PDO) {
                // Saves the PDO connection
                $this->setConnection($hostOrDSN);
            } else {
                // add full DSN string
                $this->dsn = $hostOrDSN;
            }
        } else {
            // Add the default DB credentials for MySQL
            $this->host = $hostOrDSN;
            $this->dbName = $dbName;
        }

        $this->log = new Log('DB');
    }

    /**
     * Get table object
     *
     * @param $tableName
     *
     * @return DB_Table
     */
    public function getTable($tableName)
    {
        return new DB_Table($this, $tableName);
    }

    /**
     * Set the database username
     *
     * @param string $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * Set the database user password
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * Set the name of the Database to connect to
     * @param string $dbName
     */
    public function setDbName($dbName)
    {
        $this->dbName = $dbName;
    }

    /**
     * Get the record of the last inserted record
     *
     * @return int
     */
    public function getLastInsertedID()
    {
        return $this->getConnection()->lastInsertId();
    }
	
    /**
     * Get a single row from the table depending on arguments
     *
     * @param array $arguments -  field and value pair set to look up user for
     *
     * @return bool|Collection
     */
    public function getRow($table,$arguments)
    {
        $sql = 'SELECT * FROM ' . $table . ' WHERE _arguments_ LIMIT 1';

        if (!$stmt = $this->getStatement($sql, $arguments)) {
            // Something went wrong executing the SQL statement
            return false;
        } else {
            return $stmt->fetch();
        }

    }
    public function getQuery($sql, $args = false){
        if (!$stmt = $this->getStatement($sql, $args)) {
            // Something went wrong executing the SQL statement
            return false;
        } else {
            return $stmt->fetch();
        }

    }

    /**
     * Get a PDO statement
     *
     * @param string       $sql  SQL query string
     * @param bool|mixed[] $args argument to execute the statement with
     *
     * @return bool|\PDOStatement
     */
    public function getStatement($sql, $args = false)
    {
        // The parsed sql statement
        $query = $this->buildQuery($sql, $args);
		
        if ($this->getConnection()) {
            //Prepare the statement
            if ($stmt = $this->connection->prepare($query)) {
				//Log the SQL Query first
                $this->log->report("SQL Statement: {$query}");

                // When fetched return an object
                $stmt->setFetchMode(\PDO::FETCH_INTO, new Collection());

                // If arguments were passed execute the statement
                if ($args) {
                    $this->log->report("SQL Data Sent: [" . implode(', ', $args) . "]");
                    $stmt->execute($args);
                }

                // Handles any error during execution
                if ($stmt->errorCode() > 0) {
                    $error = $stmt->errorInfo();
                    $this->log->error("PDO({$error[0]})[{$error[1]}] {$error[2]}");
                    return false;
                }

                return $stmt;
            } else {
                $this->log->error('Failed to create a PDO statement with: ' . $query);
                return false;
            }
        } else {
            // Failed to connect to the database
            return false;
        }
    }

    /**
     * Builds a query string with the passed arguments
     *
     * @param string $sql
     * @param array  $arguments - Associative array of fields and values
     *
     * @return string
     */
    private function buildQuery($sql, $arguments = null)
    {
        if (is_array($arguments)) {
            $finalArgs = array();
            foreach ($arguments as $field => $val) {
                // Parametrize the arguments
                $finalArgs[] = " {$field}=:{$field}";
            }

            // Join all the arguments as a string
            $finalArgs = implode(' AND', $finalArgs);

            if (strpos($sql, ' _arguments_')) {
                // Place the arguments string in the placeholder
                $sql = str_replace(' _arguments_', $finalArgs, $sql);
            } else {
                // Appends the parameters string the sql query
                // $sql .= $finalArgs; TODO: Watch this expression if it is on use
            }
        }

        return $sql;
    }

    /**
     * Query the table
     *
     * @param      $sql
     * @param bool $arguments
     *
     * @return bool|\PDOStatement
     */
    public function query($sql, $arguments = false)
    {
        if (!$stmt = $this->getStatement($sql, $arguments)) {
            // Something went wrong executing the SQL statement
            return false;
        } else {
            return $stmt;
        }
    }

    /**
     * Executes SQL query and checks for success
     *
     * @param string     $sql       -  SQL query string
     * @param array|bool $arguments -  Array of arguments to execute $sql with
     *
     * @return bool
     */
    public function runQuery($sql, $arguments = false)
    {
        if (!$stmt = $this->getStatement($sql, $arguments)) {
            // Something went wrong executing the SQL statement
            return false;
        }

        // If there are no arguments, execute the statement
        if (!$arguments) {
            $stmt->execute();
        }

        $rows = $stmt->rowCount();
        $rows = ($rows > 0) ? $rows : count($stmt->fetchAll());

        if ($rows > 0) {
            //Good, Rows where affected
            $this->log->report("$rows row(s) where Affected");
            return true;
        } else {
            //Bad, No Rows where Affected
            $this->log->report('No rows were Affected');
            return false;
        }
    }
	
	
    /**
     * Gets the connecting to the database
     * Check if the database connection exists if not connects to the database
     *
     * @return \PDO | bool
     */
    public function getConnection()
    {
        if (!($this->log instanceof Log)) {
            $this->log = new Log('DB');
        }

        // Use cached connection if already connected to server
        if ($this->connection instanceof \PDO) {
            return $this->connection;
        }

        $this->log->report('Connecting to database...');
        try{
            $this->connection = new \PDO($this->generateDSN(), $this->user, $this->password);
            $this->log->report('Connected to database.');
        } catch ( \PDOException $e ){
            $this->log->error('Failed to connect to database, [SQLSTATE] ' . $e->getCode());
        }
        // Check is the connection to server succeed
        if ($this->connection instanceof \PDO) {
            return true;
        } else {
            // There was an error connecting to the DB server
            return false;
        }
    }

    /**
     * Generate the DSN string for the connection
     *
     * @return string
     */
    protected function generateDSN()
    {
        if (!$this->dsn) {
            $this->dsn = "mysql:dbname={$this->dbName};host={$this->host}";
        }

        return $this->dsn;
    }

    /**
     * Set the connection
     * @param \PDO $connection
     */
    public function setConnection(\PDO $connection)
    {
        $this->connection = $connection;
    }
}
