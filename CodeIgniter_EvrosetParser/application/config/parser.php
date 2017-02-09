<?php
/**
 * Title: Конфиг для парсера http://euroset.ru/
 * Author: Petr Supe
 * Email: cmdconfig@gmail.com 
 * Date: 30.05.2015
 * Time: 10:34 AM
 */

$config = [
    'domain'=>'http://euroset.ru',
    'pageURL'=>'http://euroset.ru/catalog/phones/smartphones/',
    'uAgent'=>'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
    'cookieFilePath'=>DATADIR.'cookie'.DIRECTORY_SEPARATOR,
    'parserPages'=>DATADIR.'parserData/pages/',
    'errorPages'=>DATADIR.'parserData/errorPages/',
    'sleepTime'=>['min'=>10,'max'=>20],
    'photoPath'=>DATADIR.'photo/',
    'checkFields'=>[
        'product_id','product_name','product_description','features'
    ],
    'recursiveSleep'=>10
];