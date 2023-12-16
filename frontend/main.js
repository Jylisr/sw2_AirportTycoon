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


document.querySelector('#player-form').addEventListener('submit', function (evt) {
  evt.preventDefault(); // player must enter name
  console.log("form is supposed to show itself")
  let playerName = document.querySelector('#player-input').value;
  document.querySelector('#player-modal').classList.add('hide'); // hide form after
  document.querySelector('#player-name').innerHTML = `Player: ${playerName}`;
});

let playerName = document.querySelector('#player-name').innerHTML
let str=""
for (let i = 0; i < playerName.length; i++)
{
  str += playerName[i]
  playerName = str
}

function shop_supreme(Shopdata,total_budget) {
  function showform() {
    document.querySelector('#shop-modal').classList.remove('hide');
  }
    function submit(evt) {
    evt.preventDefault();
    console.log("Form submitted");
    let shop_name = document.querySelector('#shop-name').value;
    for (let [shopname,shopnums] of Object.entries(shopData))
      if (shop_name == shopname){
        console.log("Player has bought "+shopname+` for ${shopnums[0]}`)
        document.querySelector('#store-shop').innerText = shop_name
    // Perform any additional actions with playerName
        document.querySelector('#shop-modal').classList.add('hide'); // hide form after
        document.querySelector('#money').innerHTML = total_budget - shopnums[0];
        return shopnums
      }
  }

  let shopname = document.querySelector('#store-shop').innerText
  document.querySelector('#buybutton').addEventListener('click', showform);
  document.querySelector('#shop-modal').addEventListener('submit', submit);

}

// function to update game status
function updateStatus(status) {
  document.querySelector('#player-name').innerHTML = `Player: ${status.name}`;
  document.querySelector('#consumed').innerHTML = status.co2_consumed;
  document.querySelector('#budget').innerHTML = status.co2_budget;
  document.querySelector('#money').innerHTML = status.money;
}

// function to show weather at selected airport
function showShops(shop) {
  let shops= {}
    document.querySelector('#shop1').innerHTML = `${shop[0][shopname]}`;
    shops[shop[0][shopname]] = [shop_price, shop_revenue]
 
  document.querySelector('#shop2').innerHTML = `${shop[1][shopname]}`;
   shops[shop[1][shopname]] = [shop_price, shop_revenue]
 
  document.querySelector('#shop3').innerHTML = `${shop[2][shopname]}`;
   shops[shop[2][shopname]] = [shop_price, shop_revenue]

  document.querySelector('#shop4').innerHTML = `${shop[3][shopname]}`;
   shops[shop[3][shopname]] = [shop_price, shop_revenue]
 
  document.querySelector('#shop5').innerHTML = `${shop[4][shopname]}`;
   shops[shop[4][shopname]] = [shop_price, shop_revenue]
 
  document.querySelector('#shop6').innerHTML = `${shop[5][shopname]}`;
   shops[shop[5][shopname]] = [shop_price, shop_revenue]
 
  document.querySelector('#shop7').innerHTML = `${shop[6][shopname]}`;
   shops[shop[6][shopname]] = [shop_price, shop_revenue]
 
  document.querySelector('#shop8').innerHTML = `${shop[7][shopname]}`;
   shops[shop[7][shopname]] = [shop_price, shop_revenue]
  console.log("Shops Generated")
  return shops
}


// function to check if game is over
function checkGameOver(budget, money) {
  if (budget <= 0)
  {
    document.querySelector('#consumed').innerHTML = 10000
    document.querySelector('#budget').innerHTML = 0
    document.querySelector('#goal').classList.remove('hide');
    console.log("Game over protocols accomplished")
    return false;
  }
  else if (money <= 0){
    document.querySelector('#money').innerHTML = money;
    document.querySelector('#goal').classList.remove('hide');
    return false;
  }
  return true;
}

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup(url) {
  try {
    document.querySelector('.goal').classList.add('hide');
    airportMarkers.clearLayers();
    const gameData = await getData(url)
    updateStatus(gameData.status);
    const Locations = await getData('http://127.0.0.1:5000/flyrequest')
    if (!checkGameOver(gameData.status.co2_budget, gameData.status.money)) return;
    const Shops = await getData("http://127.0.0.1:5000/shoprequest")
    var ShopData = showShops(Shops);
    let revenue= 0
    money,revenue = shop_supreme(ShopData)
    for (let airport of Locations) {
      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
      airportMarkers.addLayer(marker);
      if (airport.active) {
        map.flyTo([airport.latitude, airport.longitude], 10);
        const Shops = await getData("http://127.0.0.1:5000/shoprequest")
        var ShopData = showShops(Shops);
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
});

// event listener to hide goal splash
document.querySelector('.goal').addEventListener('click', function (evt) {
  evt.currentTarget.classList.add('hide');
});