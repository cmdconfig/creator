<?php
/**
 * Title: Модель DB для парсера http://euroset.ru/
 * Author: Petr Supe
 * Email: cmdconfig@gmail.com 
 * Date: 30.05.2015
 * Time: 2:21 PM
 */

class DbModelEvroset extends CI_Model {
    private static $class;
    private $table;

    function __construct(){
        parent::__construct();
        $this->config->load('db_tables.php');
        $tableConfig = $this->config->item('parsers');
        $this->load->database();
        $this->table = $tableConfig['evroset'];
    }

    /**
     * Синглтон
     * @param null $options
     * @return Dbmodel
     */
    public static function forge($options = null){
        if(!self::$class){
            self::$class = new self($options);
        }

        return self::$class;
    }

    /**
     * Метод записи данных в бвзу test_parsers.evroset
     * @param array $data
     * @return mixed
     */
    public function addToBase($data){
       $query = "INSERT INTO {$this->table} (product_id,product_name,product_description,features,photo,date)
          VALUES(
              {$this->db->escape($data['product_id'])},
              {$this->db->escape($data["product_name"])},
              {$this->db->escape($data['product_description'])},
              {$this->db->escape($data['features'])},
              {$this->db->escape($data['photo'])},
              NOW()
          )";

        $this->db->simple_query($query);
        $result = $this->db->error();

        return $result;
    }
}