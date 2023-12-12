'use strict';
/* 1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', { tap: false });
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);

// global variables
const apiUrl = 'http://127.0.0.1:5000/';
const startLoc = 'Helsinki Vantaa Airport';
const globalGoals = [];
const airportMarkers = L.featureGroup().addTo(map);

// icons
const blueIcon = L.divIcon({ className: 'blue-icon' });
const greenIcon = L.divIcon({ className: 'green-icon' });

// form for player name

// function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
  const data = await response.json();
  return data;
}

// function to update game status
function updateStatus(player,consumed,budget,money) {
  document.querySelector('#player-name').innerHTML = `Player : ${player}`;
  document.querySelector('#consumed').innerHTML = consumed;
  document.querySelector('#budget').innerHTML = budget;
  document.querySelector('#money').innerHTML = money;
}
updateStatus()

// function to show weather at selected airport
function showShops(shops) {
  for (let shop of shops) {
    document.querySelector('#consumed').innerHTML = `Weather at ${airport.name}`;
  document.querySelector('#budget').innerHTML = `${airport.weather.temp}°C`;
  document.querySelector('#money').src = airport.weather.icon;
  document.querySelector('#player-name').innerHTML = airport.weather.description;
  document.querySelector('#airport-wind').innerHTML = `${airport.weather.wind.speed}m/s`;
  }
}


// function to update goal data and goal table in UI
function updateGoals(goals) {
  document.querySelector('#goals').innerHTML = '';
  for (let goal of goals) {
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    img.src = goal.icon;
    img.alt = `goal name: ${goal.name}`;
    figcaption.innerHTML = goal.description;
    figure.append(img);
    figure.append(figcaption);
    li.append(figure);
    if (goal.reached) {
      li.classList.add('done');
      globalGoals.includes(goal.goalid) || globalGoals.push(goal.goalid);
    }
    document.querySelector('#goals').append(li);
  }
}

// function to check if game is over
function checkGameOver(budget, money) {
  if (budget <= 0 || money <= 0){
    alert(`Game Over. ${globalGoals.length} goals reached.`);
    return false;
  }
  return true;
}

function gameSetup() {
  airportMarkers.clearLayers();
  let Gamedata = ['Jyli', 0, 10000, 10000];
  updateStatus('Jyli',0,10000,10000);
  if (!checkGameOver(Gamedata[2],Gamedata[3])) {
    return this;
  }
  const Locations = {"Keflavik International Airport": ["Keflavik International Airport", 63.985001, -22.6056, "Iceland", "IS"], "Brussels Airport": ["Brussels Airport", 50.901401519800004, 4.48443984985, "Belgium", "BE"], "Berlin Brandenburg Airport": ["Berlin Brandenburg Airport", 52.351389, 13.493889, "Germany", "DE"], "Frankfurt am Main Airport": ["Frankfurt am Main Airport", 50.036249, 8.559294, "Germany", "DE"], "Hamburg Helmut Schmidt Airport": ["Hamburg Helmut Schmidt Airport", 53.630402, 9.98823, "Germany", "DE"], "Cologne Bonn Airport": ["Cologne Bonn Airport", 50.8658981323, 7.1427397728, "Germany", "DE"], "D?sseldorf Airport": ["D?sseldorf Airport", 51.289501, 6.76678, "Germany", "DE"], "Munich Airport": ["Munich Airport", 48.353802, 11.7861, "Germany", "DE"], "Nuremberg Airport": ["Nuremberg Airport", 49.498699, 11.078056, "Germany", "DE"], "Leipzig/Halle Airport": ["Leipzig/Halle Airport", 51.423889, 12.236389, "Germany", "DE"], "Stuttgart Airport": ["Stuttgart Airport", 48.689899444599995, 9.22196006775, "Germany", "DE"], "Hannover Airport": ["Hannover Airport", 52.461101532, 9.685079574580001, "Germany", "DE"], "Lennart Meri Tallinn Airport": ["Lennart Meri Tallinn Airport", 59.41329956049999, 24.832799911499997, "Estonia", "EE"], "Helsinki Vantaa Airport": ["Helsinki Vantaa Airport", 60.3172, 24.963301, "Finland", "FI"], "Belfast International Airport": ["Belfast International Airport", 54.6575012207, -6.2158298492399995, "United Kingdom", "GB"], "Birmingham International Airport": ["Birmingham International Airport", 52.453899383499994, -1.74802994728, "United Kingdom", "GB"], "Manchester Airport": ["Manchester Airport", 53.349375, -2.279521, "United Kingdom", "GB"], "London Luton Airport": ["London Luton Airport", 51.874698638916016, -0.36833301186561584, "United Kingdom", "GB"], "London Gatwick Airport": ["London Gatwick Airport", 51.148102, -0.190278, "United Kingdom", "GB"], "London Heathrow Airport": ["London Heathrow Airport", 51.4706, -0.461941, "United Kingdom", "GB"], "Glasgow International Airport": ["Glasgow International Airport", 55.871899, -4.43306, "United Kingdom", "GB"], "Edinburgh Airport": ["Edinburgh Airport", 55.950145, -3.372288, "United Kingdom", "GB"], "London Stansted Airport": ["London Stansted Airport", 51.8849983215, 0.234999999404, "United Kingdom", "GB"], "Amsterdam Airport Schiphol": ["Amsterdam Airport Schiphol", 52.308601, 4.76389, "Netherlands", "NL"], "Eindhoven Airport": ["Eindhoven Airport", 51.4500999451, 5.37452983856, "Netherlands", "NL"], "Dublin Airport": ["Dublin Airport", 53.421299, -6.27007, "Ireland", "IE"], "Shannon Airport": ["Shannon Airport", 52.702, -8.92482, "Ireland", "IE"], "Billund Airport": ["Billund Airport", 55.7402992249, 9.15178012848, "Denmark", "DK"], "Copenhagen Kastrup Airport": ["Copenhagen Kastrup Airport", 55.617900848389, 12.656000137329, "Denmark", "DK"], "Luxembourg-Findel International Airport": ["Luxembourg-Findel International Airport", 49.6233333, 6.2044444, "Luxembourg", "LU"], "Bergen Airport, Flesland": ["Bergen Airport, Flesland", 60.2934, 5.21814, "Norway", "NO"], "Oslo Airport, Gardermoen": ["Oslo Airport, Gardermoen", 60.193901, 11.1004, "Norway", "NO"], "Troms? Airport, Langnes": ["Troms? Airport, Langnes", 69.683296, 18.9189, "Norway", "NO"], "Trondheim Airport, V?rnes": ["Trondheim Airport, V?rnes", 63.457802, 10.924, "Norway", "NO"], "Stavanger Airport, Sola": ["Stavanger Airport, Sola", 58.876701, 5.63778, "Norway", "NO"], "Gda?sk Lech Wa??sa Airport": ["Gda?sk Lech Wa??sa Airport", 54.377601623535156, 18.46619987487793, "Poland", "PL"], "Krak?w John Paul II International Airpor": ["Krak?w John Paul II International Airpor", 50.077702, 19.7848, "Poland", "PL"], "Warsaw Chopin Airport": ["Warsaw Chopin Airport", 52.1656990051, 20.967100143399996, "Poland", "PL"], "Gothenburg-Landvetter Airport": ["Gothenburg-Landvetter Airport", 57.662799835205, 12.279800415039, "Sweden", "SE"], "Stockholm-Arlanda Airport": ["Stockholm-Arlanda Airport", 59.651901245117, 17.918600082397, "Sweden", "SE"], "Riga International Airport": ["Riga International Airport", 56.92359924316406, 23.971099853515625, "Latvia", "LV"], "Vilnius International Airport": ["Vilnius International Airport", 54.634102, 25.285801, "Lithuania", "LT"], "Fuerteventura Airport": ["Fuerteventura Airport", 28.4527, -13.8638, "Spain", "ES"], "Gran Canaria Airport": ["Gran Canaria Airport", 27.9319, -15.3866, "Spain", "ES"], "C?sar Manrique-Lanzarote Airport": ["C?sar Manrique-Lanzarote Airport", 28.945499, -13.6052, "Spain", "ES"], "Tenerife Sur Airport": ["Tenerife Sur Airport", 28.0445, -16.5725, "Spain", "ES"], "Tirana International Airport Mother Tere": ["Tirana International Airport Mother Tere", 41.4146995544, 19.7206001282, "Albania", "AL"], "Burgas Airport": ["Burgas Airport", 42.56959915161133, 27.515199661254883, "Bulgaria", "BG"], "Sofia Airport": ["Sofia Airport", 42.696693420410156, 23.411436080932617, "Bulgaria", "BG"], "Varna Airport": ["Varna Airport", 43.232101, 27.8251, "Bulgaria", "BG"], "Zagreb Airport": ["Zagreb Airport", 45.7429008484, 16.0687999725, "Croatia", "HR"], "Alicante-Elche Miguel Hern?ndez Airport": ["Alicante-Elche Miguel Hern?ndez Airport", 38.2822, -0.558156, "Spain", "ES"], "Josep Tarradellas Barcelona-El Prat Airp": ["Josep Tarradellas Barcelona-El Prat Airp", 41.2971, 2.07846, "Spain", "ES"], "Ibiza Airport": ["Ibiza Airport", 38.872898, 1.37312, "Spain", "ES"], "Adolfo Su?rez Madrid?Barajas Airport": ["Adolfo Su?rez Madrid?Barajas Airport", 40.471926, -3.56264, "Spain", "ES"], "M?laga-Costa del Sol Airport": ["M?laga-Costa del Sol Airport", 36.6749, -4.49911, "Spain", "ES"], "Palma de Mallorca Airport": ["Palma de Mallorca Airport", 39.551701, 2.73881, "Spain", "ES"], "Santiago-Rosal?a de Castro Airport": ["Santiago-Rosal?a de Castro Airport", 42.896301, -8.41514, "Spain", "ES"], "Bordeaux-M?rignac Airport": ["Bordeaux-M?rignac Airport", 44.8283, -0.715556, "France", "FR"], "Toulouse-Blagnac Airport": ["Toulouse-Blagnac Airport", 43.629101, 1.36382, "France", "FR"], "Lyon Saint-Exup?ry Airport": ["Lyon Saint-Exup?ry Airport", 45.725556, 5.081111, "France", "FR"], "Marseille Provence Airport": ["Marseille Provence Airport", 43.439271922, 5.22142410278, "France", "FR"], "Nice-C?te d'Azur Airport": ["Nice-C?te d'Azur Airport", 43.6584014893, 7.215869903560001, "France", "FR"], "Charles de Gaulle International Airport": ["Charles de Gaulle International Airport", 49.012798, 2.55, "France", "FR"], "Paris-Orly Airport": ["Paris-Orly Airport", 48.7233333, 2.3794444, "France", "FR"], "EuroAirport Basel-Mulhouse-Freiburg Airp": ["EuroAirport Basel-Mulhouse-Freiburg Airp", 47.59, 7.529167, "France", "FR"], "Athens Eleftherios Venizelos Internation": ["Athens Eleftherios Venizelos Internation", 37.936401, 23.9445, "Greece", "GR"], "Heraklion International Nikos Kazantzaki": ["Heraklion International Nikos Kazantzaki", 35.3396987915, 25.180299758900002, "Greece", "GR"], "Thessaloniki Macedonia International Air": ["Thessaloniki Macedonia International Air", 40.51969909667969, 22.97089958190918, "Greece", "GR"], "Budapest Liszt Ferenc International Airp": ["Budapest Liszt Ferenc International Airp", 47.42976, 19.261093, "Hungary", "HU"], "Catania-Fontanarossa Airport": ["Catania-Fontanarossa Airport", 37.466801, 15.0664, "Italy", "IT"], "Falcone?Borsellino Airport": ["Falcone?Borsellino Airport", 38.175999, 13.091, "Italy", "IT"], "Cagliari Elmas Airport": ["Cagliari Elmas Airport", 39.251499, 9.05428, "Italy", "IT"], "Malpensa International Airport": ["Malpensa International Airport", 45.6306, 8.72811, "Italy", "IT"], "Milan Bergamo Airport": ["Milan Bergamo Airport", 45.673901, 9.70417, "Italy", "IT"], "Turin Airport": ["Turin Airport", 45.200802, 7.64963, "Italy", "IT"], "Bologna Guglielmo Marconi Airport": ["Bologna Guglielmo Marconi Airport", 44.5354, 11.2887, "Italy", "IT"], "Verona Villafranca Airport": ["Verona Villafranca Airport", 45.395699, 10.8885, "Italy", "IT"], "Venice Marco Polo Airport": ["Venice Marco Polo Airport", 45.505299, 12.3519, "Italy", "IT"], "Rome?Fiumicino Leonardo da Vinci Interna": ["Rome?Fiumicino Leonardo da Vinci Interna", 41.804532, 12.251998, "Italy", "IT"], "Naples International Airport": ["Naples International Airport", 40.886002, 14.2908, "Italy", "IT"], "Pisa International Airport": ["Pisa International Airport", 43.683899, 10.3927, "Italy", "IT"], "Ljubljana Jo?e Pu?nik Airport": ["Ljubljana Jo?e Pu?nik Airport", 46.223701, 14.4576, "Slovenia", "SI"], "V?clav Havel Airport Prague": ["V?clav Havel Airport Prague", 50.1008, 14.26, "Czech Republic", "CZ"], "Malta International Airport": ["Malta International Airport", 35.857498, 14.4775, "Malta", "MT"], "Vienna International Airport": ["Vienna International Airport", 48.110298, 16.5697, "Austria", "AT"], "Faro Airport": ["Faro Airport", 37.0144004822, -7.96590995789, "Portugal", "PT"], "Jo?o Paulo II Airport": ["Jo?o Paulo II Airport", 37.7411994934, -25.6979007721, "Portugal", "PT"], "Francisco de S? Carneiro Airport": ["Francisco de S? Carneiro Airport", 41.2481002808, -8.68138980865, "Portugal", "PT"], "Humberto Delgado Airport [Lisbon Portela": ["Humberto Delgado Airport [Lisbon Portela", 38.7813, -9.13592, "Portugal", "PT"], "Henri Coand? International Airport": ["Henri Coand? International Airport", 44.5711111, 26.085, "Romania", "RO"], "Geneva Cointrin International Airport": ["Geneva Cointrin International Airport", 46.23809814453125, 6.108950138092041, "Switzerland", "CH"], "Z?rich Airport": ["Z?rich Airport", 47.458056, 8.548056, "Switzerland", "CH"], "Skopje International Airport": ["Skopje International Airport", 41.961601, 21.621401, "North Macedonia", "MK"], "Belgrade Nikola Tesla Airport": ["Belgrade Nikola Tesla Airport", 44.8184013367, 20.3090991974, "Serbia", "RS"], "Podgorica Airport / Podgorica Golubovci ": ["Podgorica Airport / Podgorica Golubovci ", 42.359402, 19.2519, "Montenegro", "ME"], "M. R. ?tef?nik Airport": ["M. R. ?tef?nik Airport", 48.17020034790039, 17.21269989013672, "Slovakia", "SK"], "Lipetsk Air Base": ["Lipetsk Air Base", 52.6349983215332, 39.44499969482422, "Russia", "RU"], "Grozny North Airport": ["Grozny North Airport", 43.388302, 45.698601, "Russia", "RU"], "Olenya Air Base": ["Olenya Air Base", 68.151802062988, 33.463901519775, "Russia", "RU"], "Vladivostok International Airport": ["Vladivostok International Airport", 43.396256, 132.148155, "Russia", "RU"], "Boryspil International Airport": ["Boryspil International Airport", 50.345001220703125, 30.894699096679688, "Ukraine", "UA"], "Lviv International Airport": ["Lviv International Airport", 49.8125, 23.9561, "Ukraine", "UA"], "Pulkovo Airport": ["Pulkovo Airport", 59.80030059814453, 30.262500762939453, "Russia", "RU"], "Minsk National Airport": ["Minsk National Airport", 53.888071, 28.039964, "Belarus", "BY"], "Krasnoyarsk International Airport": ["Krasnoyarsk International Airport", 56.173077, 92.492437, "Russia", "RU"], "Novosibirsk Tolmachevo Airport": ["Novosibirsk Tolmachevo Airport", 55.019756, 82.618675, "Russia", "RU"], "Platov International Airport": ["Platov International Airport", 47.493888, 39.924722, "Russia", "RU"], "Sochi International Airport": ["Sochi International Airport", 43.449902, 39.9566, "Russia", "RU"], "Koltsovo Airport": ["Koltsovo Airport", 56.743099212646, 60.802700042725, "Russia", "RU"], "Zhukovsky International Airport": ["Zhukovsky International Airport", 55.553299, 38.150002, "Russia", "RU"], "Domodedovo International Airport": ["Domodedovo International Airport", 55.40879821777344, 37.90629959106445, "Russia", "RU"], "Sheremetyevo International Airport": ["Sheremetyevo International Airport", 55.972599, 37.4146, "Russia", "RU"], "Vnukovo International Airport": ["Vnukovo International Airport", 55.5914993286, 37.2615013123, "Russia", "RU"], "Kazan International Airport": ["Kazan International Airport", 55.606201171875, 49.278701782227, "Russia", "RU"], "Gagarin International Airport": ["Gagarin International Airport", 51.712778, 46.171111, "Russia", "RU"], "Ufa International Airport": ["Ufa International Airport", 54.557498931885, 55.874401092529, "Russia", "RU"], "Kurumoch International Airport": ["Kurumoch International Airport", 53.504901885986, 50.16429901123, "Russia", "RU"]};
  for (let [airport,list] of Object.entries(Locations)) {
    const marker = L.marker([list[1], list[2]]).addTo(map);
    airportMarkers.addLayer(marker);
    if (airport !== startLoc) {
      marker.setIcon(blueIcon);
      const popupContent = document.createElement('div');
      const h4 = document.createElement('h4');
      h4.innerHTML = airport;
      popupContent.append(h4);
      const goButton = document.createElement('button');
      goButton.classList.add('button');
      goButton.innerHTML = 'Fly me to the moon';
      popupContent.append(goButton);
      const p = document.createElement('p');
      p.innerHTML = `Distance km`;
      popupContent.append(p);
      marker.bindPopup(popupContent);
    }
    else{
      marker.bindPopup(`You are here: <b>${airport}</b>`);
      marker.openPopup();
      marker.setIcon(greenIcon);
    }
/* L.marker([
      list[1],
      list[2]]).
        addTo(map).
        bindPopup('A pretty CSS popup.<br> Easily customizable.').
        openPopup(); */
  }
}
gameSetup()

// function to set up game
// this is the main function that creates the game and calls the other functions
/* async function gameSetup(url) {
  try {
    document.querySelector('.goal').classList.add('hide');
    airportMarkers.clearLayers();
    const highscorelist = await getData('http://127.0.0.1:5000/highscore');
    const gameData = await getData(url)
    if (gameData)
    {
      console.log("Somethings evidently wrong")
    }
    else
    {
      console.log("Somethings still evidently wrong")
    }
    updateStatus(gameData.status);
    const Locations = await getData('http://127.0.0.1:5000/flyrequest')
    if (!checkGameOver(gameData.status.co2_budget, gameData.status.money)) return;
    for (let airport of Locations) {
      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
      airportMarkers.addLayer(marker);
      if (airport.active) {
        map.flyTo([airport.latitude, airport.longitude], 10);
        const Shops = await getData("http://127.0.0.1:5000/shoprequest")
        showShops(Shops);
        marker.bindPopup(`You are here: <b>${airport.name}</b>`);
        marker.openPopup();
        marker.setIcon(greenIcon);
      } else {
        marker.setIcon(blueIcon);
        const popupContent = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.innerHTML = airport.name;
        popupContent.append(h4);
        const goButton = document.createElement('button');
        goButton.classList.add('button');
        goButton.innerHTML = 'Fly here';
        popupContent.append(goButton);
        const p = document.createElement('p');
        p.innerHTML = `Distance ${airport.distance}km`;
        popupContent.append(p);
        marker.bindPopup(popupContent);
        goButton.addEventListener('click', function () {
          gameSetup(`${apiUrl}flyto/${airport.ident}`);
        });
      }
    }
    updateGoals(gameData.goals);
  } catch (error) {
    console.log(error);
  }
}

document.querySelector('#player-form').addEventListener('submit', function (evt) {
  evt.preventDefault();
  const playerName = document.querySelector('#player-input').value;
  document.querySelector('#player-modal').classList.add('hide');
  let url = `http://127.0.0.1:5000/newgame?name=${playerName}`
  gameSetup(url);
});*/

// event listener to hide goal splash
document.querySelector('.goal').addEventListener('click', function (evt) {
  evt.currentTarget.classList.add('hide');
});