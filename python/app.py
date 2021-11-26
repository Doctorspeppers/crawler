from bs4 import BeautifulSoup
import requests
import json
import MySQLdb


req = requests.get("https://www.giraffas.com.br/nossas-lojas/'")
html = BeautifulSoup(req.text, 'html.parser')
cod = json.loads(html.find_all("section",{"class":"o-map"})[0]["data-map-options"])['nonce']

reqAPI = requests.post("https://www.giraffas.com.br/wp-json/v1/listar-restaurantes",{ 'nonce': cod,
        "minLat":"-52.63975399536469",
        "minLng":"-167.34060722499999",
        "maxLat":"32.625463654649195",
        "maxLng":"69.788299025"},json=True)

dictRestaurantes = json.loads(reqAPI.text)
cnx = MySQLdb.connect(
    host="localhost",
    user="root",
    password="",
    database="girafas"
)

cursor = cnx.cursor()
count = 0
for resutarante in dictRestaurantes:
    sql = "INSERT INTO franquias (id,restaurante,regiao,estado,end,cep,cidade,fone,latitude,longitude) VALUES ("+str(resutarante["id"])+",'"+resutarante["restaurante"]+"','"+resutarante["regiao"]+"','"+resutarante["estado"]+"','"+resutarante["end"]+"','"+resutarante["cep"]+"','"+resutarante["cidade"]+"','"+resutarante["fone"]+"',"+str(resutarante["latitude"])+","+str(resutarante["longitude"])+")"
    cursor.execute(sql)
    count += 1
cnx.commit()
print(count, " record inserted.")
