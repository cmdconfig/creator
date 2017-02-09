<?php
/**
 * Title: Контроллкр парсера страницы http://euroset.ru/
 * Author: Petr Supe
 * Email: cmdconfig@gmail.com 
 * Date: 30.05.2015
 * Time: 10:16 AM
 */

class Parser extends CI_Controller {

    function __construct(){
        parent::__construct();

        if(!$this->input->is_cli_request()){
            exit();
        }
        $this->config->load('parser.php');
        $this->load->model('Parsermodel');
    }

    /**
     * Метод скачивает страницы
     */
    public function collector(){
        $pageURL = $this->config->item('pageURL');
        $this->load->model('Parsermodel');
        Parsermodel::forge()->getPages($pageURL);
    }

    /**
     * метод парсит скаченные страницы ксли $option == recursive Будит крутиться бесконечно
     * @param null $option
     */
    public function parser_run($option = null){
        $pagesNames = get_filenames($this->config->item('parserPages'));
        foreach($pagesNames as $val){
            $pagePath = $this->config->item('parserPages').$val;
            var_dump($pagePath);
            $itemArrData = Parsermodel::forge()->parsePage($pagePath);
            Parsermodel::forge()->unlockCloseFile();
            if(Parsermodel::forge()->checkParseData($itemArrData)){
                $this->load->model('DbModelEvroset');
                $baseResult = DbModelEvroset::forge()->addToBase($itemArrData);


                if($baseResult['code'] == 0){
                    if(file_exists($pagePath)) {
                        unlink($pagePath);
                    }
                    var_dump('OK');
                } elseif($baseResult['code'] == 1062){
                    if(file_exists($pagePath)) {
                        unlink($pagePath);
                    }

                    var_dump('record exists');
                } else {
                    if(file_exists($pagePath)){
                        rename($pagePath,$this->config->item('errorPages').$val);
                    }
                    var_dump('error_sql ',$baseResult['message']);
                }

            } else {
                if(file_exists($pagePath)){
                    rename($pagePath,$this->config->item('errorPages').$val);
                }

                var_dump('error_parse');
            }
        }
        if($option == 'recursive'){
            sleep($this->config->item('recursiveSleep'));
            $this->parser_run($option);
        }

    }
}