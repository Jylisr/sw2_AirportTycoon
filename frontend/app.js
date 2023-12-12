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
const startLoc = 'EFHK';
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
  let Gamedata = ['Jyli',0,10000,10000]
  updateStatus('Jyli',0,10000,10000)
  if (!checkGameOver(Gamedata[2],Gamedata[3])) {
    return this;
  }
  const Locations =
  for (let airport of Locations) {
      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
      airportMarkers.addLayer(marker);
      if (airport.active) {
        map.flyTo([airport.latitude, airport.longitude], 10);

}


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