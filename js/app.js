const link = document.querySelector(".post-job--search .post-job__search-icon");
const modal = document.querySelector(".modal");
const close = modal.querySelector("i");
const searchInput = modal.querySelector("#search");
const enterButton = modal.querySelector('button');
const weatherIcon = modal.querySelector('.weather-icon');
const temperature = modal.querySelector('.temp');
const city = modal.querySelector('.city');
const humidity = modal.querySelector('.humidity');
const windSpeed = modal.querySelector('.wind');
const card = modal.querySelector('.card');

const apiKey = "f3e559c84d85921b525063ad634edb0b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

enterButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    getWeatherData(searchTerm);
  });

link.addEventListener("click" , showModal);
close.addEventListener("click" , closeModal);

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
    const response = await fetch(apiUrl + cityName +`&appid=${apiKey}`);
    let data = await response.json();
    // .then(response => response.json())
    // .then(data => {
    //   // Extract relevant information from the API response
    //   const { currentConditions, days } = data;
    //   const { icon, temp, humidity, windspeed } = currentConditions;

    //   // Update the DOM with the weather data
    //   weatherIcon.src = `./assets/images/${icon}.png`;
    //   temperature.textContent = `${temp}℃`;
    //   city.textContent = cityName;
    //   humidity.textContent = `${humidity}%`;
    //   windSpeed.textContent = `${windspeed} km/h`;
    // })
    // .catch(error => {
    //   console.log('Error:', error);
    // });

    console.log(data);
  card.style.display = "block"
    city.innerHTML = data.name;
    temperature.innerHTML = Math.round(data.main.temp) + "℃";
    humidity.innerHTML = data.main.humidity + "%";
    windSpeed.innerHTML = Math.round(data.wind.speed) + "km/h" ;

    if (data.weather[0].main == "clouds") {
      weatherIcon.src = "./assets/images/cloudy-day.png"
    }else if(data.weather[0].main == "clear"){
      weatherIcon.src = "./assets/images/clear-day.png"
    }else if(data.weather[0].main == "Rain"){
      weatherIcon.src = "./assets/images/rain.png"
    }else if(data.weather[0].main == "Fog"){
      weatherIcon.src = "./assets/images/snow.png"
    }
  
  }
  

