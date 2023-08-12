const link = document.querySelector(".post-job--search .post-job__search-icon");
const modal = document.querySelector(".modal");
const close = modal.querySelector("i");
const searchInput = modal.querySelector("#search");
const enterButton = modal.querySelector('button');
const card = modal.querySelector('.card-weather');
const weatherIcon = card.querySelector('.weather-icon');
const temperature = card.querySelector('.temp');
const city = card.querySelector('.city');
const country = card.querySelector('.country');
const humidity = card.querySelector('.humidity');
const windSpeed = card.querySelector('.wind');
const pressure = card.querySelector('.pressure');

const savedCitiesContainer = document.createElement('div');
savedCitiesContainer.classList.add('saved-cities-container');
modal.parentNode.insertBefore(savedCitiesContainer, modal);
modal.appendChild(savedCitiesContainer)

const apiKey = "f3e559c84d85921b525063ad634edb0b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

enterButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  getWeatherData(searchTerm);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    getWeatherData(searchTerm);
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

async function getWeatherData(cityName) {

  // Example API call using fetch()
  const response = await fetch(apiUrl + cityName + `&appid=${apiKey}`);
  const error = document.querySelector(".error");
  const cardContainer = document.querySelector('.card-container');
  if (response.status == 404) {
    error.style.display = "block";
    // card.style.display = "none";
  } else {

    let data = await response.json();

    const weatherCard = createWeatherCard(data);
    cardContainer.innerHTML = '';
    cardContainer.appendChild(weatherCard)
    // card.style.display = "block";
    error.style.display = "none";
    const cityCard = createCityCard(data);
    savedCitiesContainer.appendChild(cityCard);
  }

}


const getLocation = async () => {

  const url = "http://ip-api.com/json/?fields=country,city,lat,lon,timezone";
  const response = await fetch(url);
  const data = await response.json();

  return data;
}


(async () => {
  const locationData = await getLocation();
  if (locationData !== null) {
    await getWeatherData(locationData.city);
  }
})();


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

  const cityName = document.createElement('h3');
  cityName.classList.add('city-name');
  cityName.textContent = data.name;

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button');
  removeButton.innerHTML = '<i class="fas fa-trash"></i>';

  cityCard.appendChild(cityName);
  cityCard.appendChild(removeButton);

  // add an event listener to the remove button to delete the city card
  removeButton.addEventListener('click', () => {
    cityCard.remove();
  });

  return cityCard;
}