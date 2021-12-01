<?php
require 'vendor/autoload.php';
$httpClient = new \GuzzleHttp\Client();
$response = $httpClient->get('https://www.giraffas.com.br/nossas-lojas/');
$htmlString = (string) $response->getBody();

libxml_use_internal_errors(true);
$doc = new DOMDocument();
$doc->loadHTML($htmlString);

$xpath = new DOMXPath($doc);
$classname = "o-map";
$nonce = json_decode($xpath->query("//*[contains(@class, '$classname')]/@data-map-options")->item(0)->textContent)->nonce;
$httpCli = new \GuzzleHttp\Client([
    'headers' => [ 'Content-Type' => 'application/json' ]
]);
$r = $httpCli->post('https://www.giraffas.com.br/wp-json/v1/listar-restaurantes', ['body'=>json_encode([
    "nonce"=> "'.$nonce.'",
    "minLat"=>"-52.63975399536469",
    "minLng"=>"-167.34060722499999",
    "maxLat"=>"32.625463654649195",
    "maxLng"=>"69.788299025"
])]);

$listaGirafas = json_decode($r->getBody()->getContents());


$connection = new PDO('mysql:host=localhost;dbname=girafas', "root", "");

foreach ($listaGirafas as $local) {
    $insert = $connection->prepare("INSERT INTO franquias (id,restaurante,regiao,estado,end,cep,cidade,fone,latitude,longitude) VALUES ( ".strval($local->id).",'".strval($local->restaurante)."','".strval($local->regiao)."','".strval($local->estado)."','".strval($local->end)."','".strval($local->cep)."','".strval($local->cidade)."','".strval($local->fone)."',".strval($local->latitude).",".strval($local->longitude).")");
    $insert->execute();
    print("1 valor inserido com sucesso\n");
}