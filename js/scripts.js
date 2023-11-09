var map;
var minvalue;

function createMap(){
    map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    getData();
};

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    
    for (var feature of data.features) {
        var populationValue = feature.properties.POPULATION;
        allValues.push(populationValue);
      }
    //get population for current year
    //data.features.forEach((_feature) => {});
              //add value to array
    //allValues.push(allValues);
    
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};

//Step 3: Add circle markers for point features to the map
//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "POPULATION";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>City:</b> " + feature.properties.Name + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

    popupContent += "<p><b>Population:</b> " + feature.properties[attribute] + " people </p>";
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};

function getData(){
    //load the data
    fetch('/data/Populationjson.geojson')
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //call function to create proportional symbols
            minValue = calculateMinValue(json); 
            createPropSymbols(json);
        })
    .catch(error => console.error('Error: ', error));
};

document.addEventListener('DOMContentLoaded',createMap)
//Code from Chapter 4 of Workbook
//if just pop is not enough: percentage of asians in each state; darker purple with hiher %, lighter peurple  with lower %; assumption: higher in West Coast