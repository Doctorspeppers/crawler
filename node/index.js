const rp = require('request-promise')
const cheerio = require('cheerio')
var mysql = require('mysql');


function mysqlInsertList(listaGirafas) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "girafas"});

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        console.log(listaGirafas.length)
        for (let index = 0; index < listaGirafas.length; index++) {
            
        var sql = "INSERT INTO franquias (id,restaurante,regiao,estado,end,cep,cidade,fone,latitude,longitude) VALUES ("+listaGirafas[index]["id"]+",'"+listaGirafas[index]["restaurante"]+"','"+listaGirafas[index]["regiao"]+"','"+listaGirafas[index]["estado"]+"','"+listaGirafas[index]["end"]+"','"+listaGirafas[index]["cep"]+"','"+listaGirafas[index]["cidade"]+"','"+listaGirafas[index]["fone"]+"',"+listaGirafas[index]["latitude"]+","+listaGirafas[index]["longitude"]+")";
        con.query(sql, function (err, result) {
            if (err) throw err;
                console.log("1 record inserted");
                
            })
        }
        con.end()
    })

}




function getApiKey() {
    const options = {
        uri: 'https://www.giraffas.com.br/nossas-lojas/',
        transform: function (body) {
          return cheerio.load(body)
        }
      }
      
      rp(options)
        .then(($) => {
          return JSON.parse($('.l-ours-stores')['0'].attribs['data-map-options'])['nonce'];
        })
        .catch((err) => {
          console.log(err);
        })
}


async function getLocaisGirafas(){
var options = {
    method: 'POST',
    uri: 'https://www.giraffas.com.br/wp-json/v1/listar-restaurantes',
    body: {
        'nonce': getApiKey(),
        "minLat":"-52.63975399536469",
        "minLng":"-167.34060722499999",
        "maxLat":"32.625463654649195",
        "maxLng":"69.788299025"
    },
    json: true // Automatically stringifies the body to JSON
};


result =  rp(options)
  .then((locais) => {
    return locais;
  })
  .catch((err) => {
    console.log(err);
  })

return result

}

getLocaisGirafas().then(
    (lista) => {
        mysqlInsertList(lista)
      }
)

