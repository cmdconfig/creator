<?php
/**
 * Title: Модель скачки и разбора страницы для парсера http://euroset.ru/
 * Author: Petr Supe
 * Email: cmdconfig@gmail.com 
 * Date: 30.05.2015
 * Time: 10:48 AM
 */

class Parsermodel extends CI_Model {
    /**
     * @var null
     */
    private static $class = null;
    /**
     * @var string
     */
    private $uAgent;
    /**
     * @var string
     */
    private $cookieFile = '';
    /**
     * @var mixed
     */
    public $lastRequestData;
    /**
     * @var
     */
    public $htmlFileHandle;

    function __construct($options = null){
        parent::__construct();
        $this->cookieFile = $this->config->item('cookieFilePath').uniqid().'.txt';
        $this->load->helper('file');
    }

    function __destruct(){
       $this->deleteCookie();
    }

    /**
     * Синглтон
     * @param null $options
     * @return ParserModel
     */
    public static function forge($options = null){
        if(!self::$class){
            self::$class = new self($options);
        }

        return self::$class;
    }

    /**
     * Метод коллектора, скачивает страничку по URL
     * @param string $pageURL
     */
    public function getPages($pageURL){
        $pagesNames = get_filenames($this->config->item('parserPages'));

        $data = $this->getUrl($pageURL);
        $htmlContent = iconv('windows-1251','utf-8',$data['content']);

        preg_match_all('#class="ec_visitProduct ec_previewProduct" href="(.*)" title#Uis',$htmlContent,$mch);
        if(!empty($mch[1])){


            foreach($mch[1] as $val){

                if(!in_array(md5($val).'.html',$pagesNames)){
                    var_dump($this->config->item('domain').$val);
                    $page = $this->getUrl($this->config->item('domain').$val);
                    var_dump($this->config->item('parserPages').md5($val).'.html');
                    write_file($this->config->item('parserPages').md5($val).'.html', $page['content']);
                    $sleepTime = $this->config->item('sleepTime');
                    sleep(rand($sleepTime['min'],$sleepTime['max']));
                }
            }
        }
    }

    /**
     * Метод парсит скаченную страницу и парсит данные
     * @param string $pagePath
     * @return array
     */
    public function parsePage($pagePath){
        $result = [];
        $html = $this->getFileData($pagePath);
        $html = iconv('windows-1251','utf-8',$html);

        preg_match('#<a data-product-id=([0-9]{1,}) data-product-name="(.*)" data-product-#U',$html,$mch);
        if(!empty($mch[1])){
            $result['product_id'] = trim($mch[1]);
        }
        if(!empty($mch[2])){
            $result['product_name'] = trim($mch[2]);
        }

        preg_match('#<div class=producr-description>(.*)</p>#Us',$html,$mch);
        if(!empty($mch[1])){
            $result['product_description'] = trim(strip_tags($mch[1]));
        }

        preg_match('#<table class=styled>(.*)</table>#Us',$html,$mch);
        if(!empty($mch[1])){
            preg_match_all('#<tr>(.*)</tr>#Us',$mch[1],$mchTable);
            if(!empty($mchTable[1])){
                unset($mchTable[1][count($mchTable[1])-1]);
                $features = [];
                foreach($mchTable[1] as $val){
                    preg_match("#<td class=feature>(.*):</td>.*<td class=char-val>(.*)</td>#Uis",$val,$mchFeature);
                    if(!empty($mchFeature[1]) && !empty($mchFeature[2])){
                        $features[] = ['feature'=>trim($mchFeature[1]),'val'=>trim($mchFeature[2])];
                    }
                }
                if(!empty($features)){
                    $result['features'] = json_encode($features);
                    unset($features);
                }
            }
        }

        preg_match('#<a id=thumb1 href="(.*)" class#',$html,$mch);
        if(!empty($mch[1])){
            $photo = $this->getUrl($this->config->item('domain').$mch[1]);
            $extension = $this->getExtension($photo['content_type']);
            if($extension){
                $fileName = md5($mch[1]).$extension;

                write_file($this->config->item('photoPath').$fileName, $photo['content']);
                $result['photo'] = $fileName;
            }
        }

        return $result;
    }
   public function checkParseData($data){
       foreach($this->config->item('checkFields') as $key){
           if(empty($data[$key])){
               return false;
           }
       }
       return true;
   }

    private function getFileData($path){
        if(!file_exists($path)) {
            throw new Exception('File "'.$path.'" does not exists');
        }
        else {
            $this->htmlFileHandle = fopen($path, 'r');
            $locked = flock($this->htmlFileHandle, LOCK_SH);

            if(!$locked) {
                return false;
            }
            else {
                $cts = file_get_contents($path);

//                fclose($this->htmlFileHandle);

                return $cts;
            }
        }
    }

    /**
     * Метод разблокирует и закрывает файл
     */
    public function unlockCloseFile(){
        flock($this->htmlFileHandle,LOCK_UN);
        fclose($this->htmlFileHandle);
    }

    /**
     * Метод возвращает расширение картинки
     * @param string $contentType
     * @return bool|string
     */
    private function getExtension($contentType){
        $result = false;

        switch($contentType){
            case 'image/jpeg':
                $result = '.jpg';
                break;
            case 'image/gif':
                $result = '.gif';
                break;

            case 'image/png':
                $result = '.png';
                break;
        }

        return $result;
    }

    /**
     * Метод получает данные по ссылке
     * @param string $url
     * @param string $cookieFile
     * @return mixed
     */
    private function getUrl($url){
        $ch = curl_init( $url );
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_ENCODING, "");
        curl_setopt($ch, CURLOPT_USERAGENT, $this->uAgent);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);
        curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->cookieFile);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookieFile);

        $content = curl_exec( $ch );
        $err = curl_errno( $ch );
        $errMsg = curl_error( $ch );
        $header = curl_getinfo( $ch );
        curl_close( $ch );

        $header['errNo'] = $err;
        $header['errMsg'] = $errMsg;
        $header['content'] = $content;
        $this->lastRequestData = $header;

        return $header;
    }

    /**
     * Метод удаляет cookie. нужно чтоб не захламляться
     */
    private function deleteCookie(){
        if(file_exists($this->cookieFile)) {
            unlink($this->cookieFile);
        }


    }



}