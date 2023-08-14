const link = document.querySelector(".post-job--search .post-job__search-icon");
const modal = document.querySelector(".modal");
const close = modal.querySelector("i");
const searchInput = modal.querySelector("#search");
const enterButton = modal.querySelector('button');
const card = modal.querySelector('.weather .card-weather');
const weatherIcon = card.querySelector('.weather-icon');
const temperature = card.querySelector('.temp');
const city = card.querySelector('.city');
const country = card.querySelector('.country');
const humidity = card.querySelector('.humidity');
const windSpeed = card.querySelector('.wind');
const pressure = card.querySelector('.pressure');

let cityCardCount = 0;
const savedCitiesContainer = document.createElement('div');
savedCitiesContainer.classList.add('saved-cities-container');
modal.parentNode.insertBefore(savedCitiesContainer, modal);
modal.appendChild(savedCitiesContainer)

const apiKey = "f3e559c84d85921b525063ad634edb0b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


enterButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  getWeatherData(searchTerm);
  searchInput.value ="";
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    getWeatherData(searchTerm);
    searchInput.value ="";
  }
});
link.addEventListener("click", showModal);
close.addEventListener("click", closeModal);

function showModal() {
  modal.style.transform = `scale(1)`;
  searchInput.focus();
}

function closeModal() {
  modal.style.transform = `scale(0)`;
  searchInput.value = "";
}

// Define an array to store existing cities
let existingCities = [];

async function getWeatherData(cityName) {
  const response = await fetch(apiUrl + cityName + `&appid=${apiKey}`);
  const error = document.querySelector(".error");
  const cardContainer = document.querySelector('.card-container');

  if (response.status == 404) {
    error.style.display = "block";
    card.style.display = "none";
  } else {
    let data = await response.json();

    const weatherCard = createWeatherCard(data);
    cardContainer.innerHTML = '';
    card.style.display = "block";
    cardContainer.style.display = "block";
    cardContainer.appendChild(weatherCard);
    error.style.display = "none";
    const cityName = data.name;

    // Check if the city already exists in the array
   // Check if the city already exists in savedCities array
const existingCityIndex = savedCities.findIndex((city) => city.name === data.name);

if (existingCityIndex === -1) {
  // City doesn't exist, create a new city card
  const cityCard = createCityCard(data);

  // Add the new city card to the saved cities container
  savedCitiesContainer.insertBefore(cityCard, savedCitiesContainer.firstChild);

  // Add the city to the saved cities array
  savedCities.unshift({
    name: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    weatherIcon: getWeatherIcon(data.weather[0].main)
  });

  // Limit the number of cities to three
  if (savedCities.length > 3) {
    // Remove the oldest city card from the saved cities container
    savedCitiesContainer.removeChild(savedCitiesContainer.lastChild);

    // Remove the oldest city from the saved cities array
    savedCities.pop();
  }
} else {
  // City already exists, you can choose to update the existing card or take any other action
  const existingCityCard = savedCitiesContainer.children[existingCityIndex];
  // Update the existing city card with the latest data
  updateCityCard(existingCityCard, data);
}

// Store the updated saved cities array in the local storage
localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }
}




function createWeatherCard(data) {
  const weatherCard = document.createElement('div');
  weatherCard.classList.add('card-weather');

  const weatherIcon = document.createElement('img');
  weatherIcon.classList.add('weather-icon');
  weatherIcon.src = getWeatherIcon(data.weather[0].main);

  const cityElem = document.createElement('h2');
  cityElem.classList.add('city');
  cityElem.textContent = data.name;

  const countryElem = document.createElement('p');
  countryElem.classList.add('country');
  countryElem.textContent = data.sys.country;

  const tempElem = document.createElement('h1');
  tempElem.classList.add('temp');
  tempElem.textContent = `${Math.round(data.main.temp)}°C`;

  const humidityElem = document.createElement('p');
  humidityElem.classList.add('humidity');
  humidityElem.textContent = `${data.main.humidity}%`;

  const windElem = document.createElement('p');
  windElem.classList.add('wind');
  windElem.textContent = `${Math.round(data.wind.speed)} km/h`;

  const detailsElem = document.createElement('div');
  detailsElem.classList.add('details');

  const humidityCol = document.createElement('div');
  humidityCol.classList.add('col');
  const humidityIcon = document.createElement('img');
  humidityIcon.src = './assets/images/download.jpg';
  const humidityText = document.createElement('div');
  const humidityLabel = document.createElement('p');
  humidityLabel.textContent = 'Humidity';
  const humidityValue = document.createElement('p');
  humidityValue.classList.add('humidity');
  humidityValue.textContent = `${data.main.humidity}%`;
  humidityText.appendChild(humidityValue);
  humidityText.appendChild(humidityLabel);
  humidityCol.appendChild(humidityIcon);
  humidityCol.appendChild(humidityText);

  const windCol = document.createElement('div');
  windCol.classList.add('col');
  const windIcon = document.createElement('img');
  windIcon.src = './assets/images/wind.png';
  const windText = document.createElement('div');
  const windLabel = document.createElement('p');
  windLabel.textContent = 'Wind Speed';
  const windValue = document.createElement('p');
  windValue.classList.add('wind');
  windValue.textContent = `${Math.round(data.wind.speed)} km/h`;
  windText.appendChild(windValue);
  windText.appendChild(windLabel);
  windCol.appendChild(windIcon);
  windCol.appendChild(windText);

  const pressureContainer = document.createElement('div');
  pressureContainer.classList.add('pressure-container');

  const pressureLabel = document.createElement('p');
  pressureLabel.classList.add('pressure-label');
  pressureLabel.textContent = 'Pressure';

  const pressureValue = document.createElement('p');
  pressureValue.classList.add('pressure');
  pressureValue.textContent = `${Math.round(data.main.pressure)} mbar`;

  pressureContainer.appendChild(pressureValue);
  pressureContainer.appendChild(pressureLabel);

  detailsElem.appendChild(humidityCol);
  detailsElem.appendChild(windCol);

  weatherCard.appendChild(weatherIcon);
  weatherCard.appendChild(cityElem);
  weatherCard.appendChild(countryElem);
  weatherCard.appendChild(tempElem);
  weatherCard.appendChild(detailsElem);
  weatherCard.appendChild(pressureContainer)
  return weatherCard;
}


function getWeatherIcon(condition) {
  switch (condition) {
    case "Clouds":
      return "./assets/images/cloudy-day.png";
    case "Clear":
      return "./assets/images/clear-day.png";
    case "Rain":
      return "./assets/images/rain.png";
    case "Fog":
      return "./assets/images/snow.png";
    default:
      return "./assets/images/cloudy-day.png";
  }
}

function createCityCard(data) {
  const cityCard = document.createElement('div');
  cityCard.classList.add('city-card');

  const weatherIcon = document.createElement('img');
  weatherIcon.classList.add('weather-icon');
  weatherIcon.src = getWeatherIcon(data.weather[0].main);

  const cityElem = document.createElement('h2');
  cityElem.classList.add('city');
  cityElem.textContent = data.name;

  const countryElem = document.createElement('h4');
  countryElem.classList.add('country');
  countryElem.textContent = data.sys.country;

  const tempElem = document.createElement('p');
  tempElem.classList.add('temp');
  tempElem.innerHTML = `${Math.round(data.main.temp)}<span class="temp-unit">°C</span>`;

  const detailsElem = document.createElement('div');
  detailsElem.classList.add('details');

  const humidityElem = document.createElement('p');
  humidityElem.classList.add('humidity');
  humidityElem.innerHTML = `<i class="fas fa-tint"></i> ${data.main.humidity}%`;

  const windElem = document.createElement('p');
  windElem.classList.add('wind');
  windElem.innerHTML = `<i class="fas fa-wind"></i> ${Math.round(data.wind.speed)} km/h`;

  detailsElem.appendChild(humidityElem);
  detailsElem.appendChild(windElem);

  cityCard.appendChild(weatherIcon);
  cityCard.appendChild(cityElem);
  cityCard.appendChild(countryElem);
  cityCard.appendChild(tempElem);
  cityCard.appendChild(detailsElem);

  const cityData = {
    name: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    weatherIcon: getWeatherIcon(data.weather[0].main)
  };
  const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
  const existingCity = savedCities.find(city => city.name === cityData.name);
  if (!existingCity) {
    savedCities.unshift(cityData);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }
  return cityCard;
}

// Read the saved cities from local storage and create city cards for each saved city
const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

const MAX_CITY_CARDS = 3; // Maximum number of city cards to display

// Truncate the savedCities array if it exceeds the maximum limit
if (savedCities.length > MAX_CITY_CARDS) {
  savedCities.splice(MAX_CITY_CARDS);
}
for (const cityData of savedCities) {
  const cityCard = createCityCard({
    name: cityData.name,
    sys: { country: cityData.country },
    main: { temp: cityData.temperature, humidity: cityData.humidity },
    wind: { speed: cityData.windSpeed },
    weather: [{ main: getWeatherData(cityData.weatherIcon) }]
  });
  savedCitiesContainer.appendChild(cityCard);
}