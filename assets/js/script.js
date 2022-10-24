var searchForm = $('#search-form')
var searchInput = $('#city-search')
var cityHistory = $('#city-history')
var cityName = $('#city-name')
var todaysDate = $('#today-date')
var todayWeather = $('#today-weather')
var today = moment().format('M/DD/YYYY')
var dateCall = moment()
var mainTemp = $('#main-temp')
var mainWind = $('#main-wind')
var mainHumid = $('#main-humid')
var fiveDay = $('#five-day-container')
var forecastLi = $(`<li>`)
var searchBtn = $('#search')
var cityhistoryUl = $('#city-history')
var weatherHistory = []

var defaultCity = 'http://api.openweathermap.org/geo/1.0/direct?q=Austin&limit=1&appid=7c376007b276fb1ba9659c33e922f8d2'

// DEFAULT DISPLAYED CITY WILL BE AUSTIN
function searchCall(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            console.log(`status is: ${response.status}`)
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat
            var lon = data[0].lon
            lat = lat.toFixed(2)
            lon = lon.toFixed(2)
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=7c376007b276fb1ba9659c33e922f8d2`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (newData) {
                    console.log(newData)
                    cityName.text(newData.city.name);
                    todaysDate.text(today);
                    topweatherCheck(newData);
                    mainTemp.text(`${newData.list[0].main.temp} °F`);
                    mainWind.text(`${newData.list[0].wind.speed} MPH`);
                    mainHumid.text(`${newData.list[0].main.humidity} %`);
                    fivedayForecast(newData);
                })
        })
        
}

function fivedayForecast(forecastData) {
    $("#five-day-container").empty();
    for (var i = 0; i < 5; i++) {
        // THIS IS THE EQUATION TO GET THE SAME TIME OF EACH OF THE NEXT 5 DAYS FROM THE WEATHER DATA ARRAY
        var d = i
        if (i > 0) {
            d = (i * 8)
        }
        // ...
        var daystoAdd = (i + 1)
        var cardDiv = $('<div>')
        cardDiv.addClass('day-card')
        var pDate = $('<p>')
        pDate.text(moment().add(daystoAdd, 'days').format('M/DD/YYYY'))
        var pIcon = $('<p>')
        pIcon.text(weatherCheck(forecastData, d))
        cardDiv.append(pDate)
        cardDiv.append(pIcon[0])
        var cardUl = $('<ul>')

        cardDiv.append(cardUl)
        cardUl.addClass('city-stats')
        cardUl.append('<li>' + "Temp: " + `${forecastData.list[d].main.temp} °F` ,'</li>')
        cardUl.append('<li>' + "Wind: " + `${forecastData.list[d].wind.speed} MPH` ,'</li>')
        cardUl.append('<li>' + "Humidity: " + `${forecastData.list[d].main.humidity} %` ,'</li>')
        $("#five-day-container").append($(cardDiv[0]))
    }
}

function topweatherCheck(topweatherData) {
    if (topweatherData.list[0].weather[0].main == 'Clouds') {
        todayWeather.text('☁️')
    } else if (topweatherData.list[0].weather[0].main == 'Rain') {
        todayWeather.text('🌧️')
    } else if (topweatherData.list[0].weather[0].main == 'Clear') {
        todayWeather.text('☀️')
    }
}

function weatherCheck(weatherData, f) {
    console.log(`What is f: ${f}?`)
    if (weatherData.list[f].weather[0].main == 'Clouds') {
        return '☁️'
    } else if (weatherData.list[f].weather[0].main == 'Rain') {
        return '🌧️'
    } else if (weatherData.list[f].weather[0].main == 'Clear') {
        return '☀️'
    }
}

function weatherSearch(event) {
    event.preventDefault();
    var element = event.target
    var searchItem = ""
    if (element.matches("li")) {
        searchItem = element.innerHTML
    } else {
        searchItem = $('input[name="city-search"]').val();
        console.log(searchItem)
        if ((searchItem !== "") && (!weatherHistory.includes(searchItem)))  {
            cityhistoryUl.append('<li>' + searchItem + '</li>');
            weatherHistory.push(searchItem);
            console.log(weatherHistory)
            localStorage.setItem('history', JSON.stringify(weatherHistory));
        }

    }

    if (!searchItem) {
        console.log("Nothing was entered!")
        return;
    }
    var searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchItem}&limit=1&appid=7c376007b276fb1ba9659c33e922f8d2`;
    searchCall(searchUrl);
    $('input[name="city-search"]').val('');

} 

function init() {
    searchCall(defaultCity);
    var wHistory = JSON.parse(localStorage.getItem("history"))
    if (wHistory !== null) {
        weatherHistory = wHistory;
        for (var i = 0; i < wHistory.length; i++) {
            cityhistoryUl.append('<li>' + wHistory[i] + '</li>');
        }
    }
    
}

// CLICK EVENT FOR SEARCH BUTTON
searchForm.on('submit', weatherSearch);

// CLICK EVENT FOR SEARCHING WITH THE HISTORY
cityhistoryUl.on('click', weatherSearch);

// INITIAL DEFAULT CITY DISPLAY (AUSTIN, MY CITY!)
// INTIAL FUNCTION TO SET UP THE PAGE
init();

