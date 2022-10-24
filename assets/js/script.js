// ELEMENT SELECTORS
var searchForm = $('#search-form')
var searchInput = $('#city-search')
var cityHistory = $('#city-history')
var cityName = $('#city-name')
var todaysDate = $('#today-date')
var todayWeather = $('#today-weather')
var mainTemp = $('#main-temp')
var mainWind = $('#main-wind')
var mainHumid = $('#main-humid')
var fiveDay = $('#five-day-container')
var forecastLi = $(`<li>`)
var searchBtn = $('#search')
var cityhistoryUl = $('#city-history')

// GLOBAL TIME VARIABLES
var today = moment().format('M/DD/YYYY')
var dateCall = moment()

// NEED TO CREATE THIS ARRAY SO IT CAN BE USED LATER FOR LOCAL STORAGE
var weatherHistory = []

// DEFAULT CITY FOR THE INITIAL PAGE LOAD (AUSTIN, MY CITY!)
var defaultCity = 'http://api.openweathermap.org/geo/1.0/direct?q=Austin&limit=1&appid=7c376007b276fb1ba9659c33e922f8d2'

// API CALL FOR GETTING THE LATITUDE/LONGITUDE OF THE ENTERED CITY
function searchCall(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat
            var lon = data[0].lon
            lat = lat.toFixed(2)
            lon = lon.toFixed(2)
            // NOW A FETCH CALL PLUGGING IN THE LAT/LON VALUES TO GET THE WEATHER DATA
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=7c376007b276fb1ba9659c33e922f8d2`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (newData) {
                    console.log(newData)
                    // UPDATING VALUES IN THE TOP CARD (TODAY)
                    cityName.text(newData.city.name);
                    todaysDate.text(today);
                    // RUNS A CHECK TO GET THE CORRECT WEATHER ICON
                    topweatherCheck(newData);
                    mainTemp.text(`${newData.list[0].main.temp} °F`);
                    mainWind.text(`${newData.list[0].wind.speed} MPH`);
                    mainHumid.text(`${newData.list[0].main.humidity} %`);
                    // CALLING THE FUNCTION TO CREATE THE 5 DAY CARDS
                    fivedayForecast(newData);
                })
        })
        
}

// FUNCTION FOR CREATING THE 5 DAY FORECAST CARDS
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

// WEATHER CHECK FOR THE TOP "MAIN" CARD
function topweatherCheck(topweatherData) {
    if (topweatherData.list[0].weather[0].main == 'Clouds') {
        todayWeather.text('☁️')
    } else if (topweatherData.list[0].weather[0].main == 'Rain') {
        todayWeather.text('🌧️')
    } else if (topweatherData.list[0].weather[0].main == 'Clear') {
        todayWeather.text('☀️')
    } else if (topweatherData.list[0].weather[0].main == 'Snow') {
        todayWeather.text('❄️')
    }
}

// WEATHER CHECK FOR THE FORECAST CARDS
function weatherCheck(weatherData, f) {
    if (weatherData.list[f].weather[0].main == 'Clouds') {
        return '☁️'
    } else if (weatherData.list[f].weather[0].main == 'Rain') {
        return '🌧️'
    } else if (weatherData.list[f].weather[0].main == 'Clear') {
        return '☀️'
    } else if (weatherData.list[f].weather[0].main == 'Snow') {
        return '❄️'
    }
}

// FUNCTION FOR WHEN THE SUBMIT BUTTON OR HISTORY ITEMS ARE CLICKED
function weatherSearch(event) {
    event.preventDefault();
    var element = event.target
    var searchItem = ""
    // I DIDN'T WANT IT TO ADD A NEW LIST ITEM OR ADD IT TO STORAGE IF A HISTORY ITEM WAS SELECTED
    if (element.matches("li")) {
        searchItem = element.innerHTML
    // IF IT'S NOT A HISTORY ITEM IT WILL ADD THE NEW VALUE TO THE LIST AND TO LOCAL STORAGE
    } else {
        searchItem = $('input[name="city-search"]').val();
        if ((searchItem !== "") && (!weatherHistory.includes(searchItem)))  {
            cityhistoryUl.append('<li>' + searchItem + '</li>');
            weatherHistory.push(searchItem);
            localStorage.setItem('history', JSON.stringify(weatherHistory));
        }
    }
    if (!searchItem) {
        return;
    }
    // CREATED A VARIABLE TO STORE THE URL CONTAINING THE INPUT CITY
    var searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchItem}&limit=1&appid=7c376007b276fb1ba9659c33e922f8d2`;
    searchCall(searchUrl);
    $('input[name="city-search"]').val('');
} 

// INITIAL FUNCTION TO PULL IN LOCAL STORAGE AND GET UPDATED DEFAULT CITY ONTO THE PAGE
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

// INTIAL FUNCTION TO SET UP THE PAGE
init();

