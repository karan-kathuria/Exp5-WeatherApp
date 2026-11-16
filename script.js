function getWeather() {
    var city = document.getElementById("cityInput").value.trim();
    var message = document.getElementById("message");
    var result = document.getElementById("result");

    if (city === "") {
        message.textContent = "Please enter a city name.";
        result.innerHTML = "";
        return;
    }

    message.textContent = "Loading...";
    result.innerHTML = "";

    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (!data.results) {
                throw new Error("City not found. Try another city.");
            }

            var place = data.results[0];
            var url = "https://api.open-meteo.com/v1/forecast?latitude=" +
                place.latitude + "&longitude=" + place.longitude +
                "&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto";

            return fetch(url).then(function(response) {
                return response.json();
            }).then(function(weatherData) {
                var weather = weatherData.current;
                message.textContent = "";
                result.innerHTML =
                    "<h2>" + place.name + ", " + place.country + "</h2>" +
                    "<p class='temperature'>" + weather.temperature_2m + "°C</p>" +
                    "<p>Humidity: " + weather.relative_humidity_2m + "%</p>" +
                    "<p>Wind speed: " + weather.wind_speed_10m + " km/h</p>";
            });
        })
        .catch(function(error) {
            message.textContent = error.message;
        });
}
