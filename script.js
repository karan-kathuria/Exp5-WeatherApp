var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var result = document.getElementById("result");
var message = document.getElementById("message");

// Convert weather codes into simple descriptions
function getWeatherText(code) {
    if (code === 0) {
        return "Clear Sky ☀️";
    } else if (code === 1 || code === 2 || code === 3) {
        return "Partly Cloudy 🌤️";
    } else if (code === 45 || code === 48) {
        return "Foggy 🌫️";
    } else if (code >= 51 && code <= 67) {
        return "Drizzle or Rain 🌧️";
    } else if (code >= 71 && code <= 77) {
        return "Snowfall ❄️";
    } else if (code >= 80 && code <= 82) {
        return "Rain Showers 🌦️";
    } else if (code >= 95) {
        return "Thunderstorm ⛈️";
    } else {
        return "Cloudy 🌥️";
    }
}

// Search for a city and get its weather
function getWeather() {
    var city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        result.innerHTML = "";
        return;
    }

    message.textContent = "Loading weather...";
    result.innerHTML = "";

    // Find the city's location
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=en&format=json")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Unable to search for the city.");
            }
            return response.json();
        })
        .then(function(data) {
            if (!data.results || data.results.length === 0) {
                throw new Error("City not found. Please try another name.");
            }

            var location = data.results[0];
            var latitude = location.latitude;
            var longitude = location.longitude;

            // Get the current weather for the city
            return fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto")
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error("Unable to fetch weather data.");
                    }
                    return response.json();
                })
                .then(function(data) {
                    var weather = data.current;

                    message.textContent = "";
                    result.innerHTML =
                        "<h2>" + location.name + ", " + location.country + "</h2>" +
                        "<p class='temp'>" + weather.temperature_2m + "°C</p>" +
                        "<p class='weather-info'>" + getWeatherText(weather.weather_code) + "</p>" +
                        "<p class='weather-info'>Feels like: " + weather.apparent_temperature + "°C</p>" +
                        "<p class='weather-info'>Humidity: " + weather.relative_humidity_2m + "%</p>" +
                        "<p class='weather-info'>Wind speed: " + weather.wind_speed_10m + " km/h</p>";
                });
        })
        .catch(function(error) {
            message.textContent = error.message;
            result.innerHTML = "";
        });
}

// Search when the button is clicked
searchBtn.addEventListener("click", getWeather);

// Also search when Enter is pressed
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});