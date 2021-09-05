/////////////////////  Detailed 1 day card /////////////
var currentCity = "";
var api = "92e13c00310a759d09c4499af092d554";

var getCurrentConditions = (event) => {
    // Obtain city name from the search box
    let searchedCity = $('#search').val();
    currentCity= $('#search').val();

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&units=imperial" + "&APPID=" + api;
    fetch(queryURL)
    .then((response) => {
        return response.json();
    }) 
    .then((response) => {

        saveCity(searchedCity);
        $('#search-error').text("");
        let weatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        // Offset UTC timezone - using moment.js
        let currentTimeUTC = response.dt;
        let currentTimeZoneOffset = response.timezone;
        let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
        // Render cities list
        renderCities();
        // Obtain the 5day forecast for the searched city
        getFiveDayForecast(event);
        // Set the header text to the found city name
        $('#header-text').text(response.name);
        // HTML for the results of search
        let currentWeatherHTML = `
            <h2>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h2>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp};</li>
                <li>Humidity: ${response.main.humidity}</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>`;
        // Append the results to the DOM
        $('#currentDay').html(currentWeatherHTML);
        // Get the latitude and longitude for the UV search from Open Weather Maps API
        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvQuery = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + api;
        // API solution for Cross-origin resource sharing (CORS) error: https://cors-anywhere.herokuapp.com/
        uvQueryURL = "https://cors-anywhere.herokuapp.com/" + uvQuery;
        // FETCH the UV index and color
        fetch(uvQuery)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
        });
    })
}




    // https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=92e13c00310a759d09c4499af092d554

function renderWeather(weatherData) {
    var currentDayDiv = document.querySelector("#currentDay")
    currentDayDiv.innerHTML = `<div class="card, col-12" id="currentDayCard";>
    <div class="card-header">
        City:
      ${weatherData.name}
      Date: ${weatherData.dt}

    </div>
    <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png">
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temp: ${weatherData.main.temp + " F"}</li>
      <li class="list-group-item">Humidity: ${weatherData.main.humidity + "%"}</li>
      <li class="list-group-item">Wind Speed: ${weatherData.wind.speed} MPH</li>
      <li class="list-group-item">UV Index: ${weatherData.wind.speed} MPH</li>
    </ul>
    
  </div>`
}
//////////////////// Detailed 1 day card end///////////////////

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    // console.log(localStorage.getItem("City"));
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}
///////////////


fetch ("https://api.openweathermap.org/data/2.5/forecast?q=Denver,Colorado&units=imperial&appid=92e13c00310a759d09c4499af092d554")
.then(response => response.json())
.then(data => {
    console.log(data)    
   // renderFiveDay
   renderFiveDay(data)
})

function renderFiveDay(forecastData) {
    var fiveDayArea = document.querySelector("#fiveDayForecast")
    fiveDayArea.innerHTML = `<div class="row">
    <div class="card" style="width: auto;">
    <div class="card-header">
      ${forecastData.city.name}
    </div>
    
    <ul class="list-group list-group-flush">
    <li class="list-group-item">Temp: ${forecastData.list[0].main.temp + " F"}</li>
    <li class="list-group-item">Humidity: ${forecastData.list[0].main.temp_max + "%"}</li>
    <li class="list-group-item">Conditions: ${forecastData.list[0].main.temp_min}</li>
    </ul>
    <img src="http://openweathermap.org/img/w/${forecastData.list[0].weather[0].icon}> }
  </div>
  </div>`
}

