var map = L.map('map').setView([51, 0], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch('/data/Populationjson.geojson') 
   .then(response => response.json()) 
   .then(data => {
    L.geoJSON(data).addTo(map);
   })
    .catch(error => console.error('Error: ', error));
    
//if just pop is not enough: percentage of asians in each state; darker purple with hiher %, lighter peurple  with lower %; assumption: higher in West Coast