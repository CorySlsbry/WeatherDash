fetch ("https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=92e13c00310a759d09c4499af092d554")
.then(response => response.json())
.then(data => {
    console.log(data)
    renderWeather(data)
})

function renderWeather(weatherData) {
    var currentDayDiv = document.querySelector("#currentDay")
    currentDayDiv.innerHTML = `<div class="card" style="width: 18rem;">
    <div class="card-header">
      ${weatherData.name}
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">temp: ${weatherData.main.temp}</li>
      <li class="list-group-item">A second item</li>
      <li class="list-group-item">A third item</li>
    </ul>
    <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png">
  </div>`
}


/*
https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={92e13c00310a759d09c4499af092d554}

var myName = "jim"
console.log("hi there " + myName)
console.log(`hi there ${myName}! `)
function(response) {

}*/