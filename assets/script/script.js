// Set global variables, including Open Weather Maps API Key
var apiKey = "92e13c00310a759d09c4499af092d554";
var currentCity = "";
var lastCity = "";

// Function to get and display the current conditions on Open Weather Maps
var getCurrentWeather = (event) => {

    // Obtain city name from the search box
    let searchedCity = $('#searchCity').val();
    currentCity = $('#searchCity').val();
console.log(searchedCity);
console.log(currentCity);
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&units=imperial" + "&APPID=" + apiKey;
    console.log(apiURL)
    fetch(apiURL)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        // Save city to local storage
        saveCity(searchedCity);

        // Create icon for the current weather using Open Weather Maps
        let currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

        let currentTimeUTC = response.dt;
        let currentMoment = moment.unix(currentTimeUTC).utc();
        // Render cities list
        renderCities();

        getFiveDay(event);

        let currentWeatherHTML = `
            <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"></h3>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp}&#8457;</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>`;
        // Append the results to the DOM
        $('#current-weather').html(currentWeatherHTML);

        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvLink = "api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&APPID=" + apiKey;
        // API solution for Cross-origin resource sharing (CORS) error: https://cors-anywhere.herokuapp.com/
        uvLink = "https://cors-anywhere.herokuapp.com/" + uvLink;
        // Fetch the UV information and build the color display for the UV index
        fetch(uvLink)
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

// Function to obtain the five day forecast and display to HTML
var getFiveDay = (event) => {
    let searchedCity = $('#searchCity').val();
    // Set up URL for API search using forecast search
    let apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&units=imperial" + "&APPID=" + apiKey;
    // Fetch from API
    fetch(apiURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
        // HTML template
        let fiveDayForecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
        // Loop over the 5 day forecast and build the template HTML using UTC offset and Open Weather Map icon
        for (let i = 0; i < response.list.length; i++) {
            let dayData = response.list[i];
            let dayTimeUTC = dayData.dt;
            let thisMoment = moment.unix(dayTimeUTC).utc();
            let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
            // Only displaying mid-day forecasts
            if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                fiveDayForecastHTML += `
                <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayData.main.temp}&#8457;</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
            }
        }
        // Build the HTML template
        fiveDayForecastHTML += `</div>`;
        // Append the five-day forecast to the DOM
        $('#five-day-forecast').html(fiveDayForecastHTML);
    })
}

// SAVE to local storage
var saveCity = (newCity) => {
    let cityExists = false;

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break;
        }
    }

    if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}

// Render the list of searched cities
var renderCities = () => {
    $('#city-results').empty();
    // If localStorage is empty
    if (localStorage.length===0){
        if (lastCity){
            $('#search-city').attr("value", lastCity);
        } else {
            $('#search-city').attr("value", "");
        }
    } else {
        let lastCityKey="cities"+(localStorage.length-1);
        lastCity=localStorage.getItem(lastCityKey);

        $('#search-city').attr("value", lastCity);
        // Append stored cities to page
        for (let i = 0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl;
            // Set to lastCity if currentCity not set
            if (currentCity===""){
                currentCity=lastCity;
            }
            // Set button class to active for currentCity
            if (city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            } 
            // Append city to page
            $('#city-results').prepend(cityEl);
        }
        // Add a "clear" button to page if there is a cities list
        if (localStorage.length>0){
            $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
        } else {
            $('#clear-storage').html('');
        }
    }
    
}

// SEARCH BTN 
$('#search-button').on("click", (event) => {
event.preventDefault();
currentCity = $('#search-city').val();
getCurrentWeather(event);
});

renderCities();
getCurrentWeather();

    // https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=92e13c00310a759d09c4499af092d554

// function renderWeather(weatherData) {
//     var currentDayDiv = document.querySelector("#currentDay")
//     currentDayDiv.innerHTML = `<div class="card, col-12" id="currentDayCard";>
//     <div class="card-header">
//         City:
//       ${weatherData.name}
//       Date: ${weatherData.dt}

//     </div>
//     <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png">
//     <ul class="list-group list-group-flush">
//       <li class="list-group-item">Temp: ${weatherData.main.temp + " F"}</li>
//       <li class="list-group-item">Humidity: ${weatherData.main.humidity + "%"}</li>
//       <li class="list-group-item">Wind Speed: ${weatherData.wind.speed} MPH</li>
//       <li class="list-group-item">UV Index: ${weatherData.wind.speed} MPH</li>
//     </ul>
    
//   </div>`
// }
// //////////////////// Detailed 1 day card end///////////////////

// // Forloop for persisting the data onto HMTL page
// for (var i = 0; i < localStorage.length; i++) {

//     var city = localStorage.getItem(i);
//     // console.log(localStorage.getItem("City"));
//     var cityName = $(".list-group").addClass("list-group-item");

//     cityName.append("<li>" + city + "</li>");
// }
// ///////////////


// fetch ("https://api.openweathermap.org/data/2.5/forecast?q=Denver,Colorado&units=imperial&appid=92e13c00310a759d09c4499af092d554")
// .then(response => response.json())
// .then(data => {
//     console.log(data)    
//    // renderFiveDay
//    renderFiveDay(data)
// })

// function renderFiveDay(forecastData) {
//     var fiveDayArea = document.querySelector("#fiveDayForecast")
//     fiveDayArea.innerHTML = `<div class="row">
//     <div class="card" style="width: auto;">
//     <div class="card-header">
//       ${forecastData.city.name}
//     </div>
    
//     <ul class="list-group list-group-flush">
//     <li class="list-group-item">Temp: ${forecastData.list[0].main.temp + " F"}</li>
//     <li class="list-group-item">Humidity: ${forecastData.list[0].main.temp_max + "%"}</li>
//     <li class="list-group-item">Conditions: ${forecastData.list[0].main.temp_min}</li>
//     </ul>
//     <img src="http://openweathermap.org/img/w/${forecastData.list[0].weather[0].icon}> }
//   </div>
//   </div>`
// }

