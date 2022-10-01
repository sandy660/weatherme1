const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const key = 'a2685f057ae56c537cc59bef85a2e80c';

var button = document.getElementById('button');
var inputValue = document.getElementById('input');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hours12HourFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
    const am_pm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hours12HourFormat < 10 ? '0' : '') + hours12HourFormat + ':' + minutes + ' ' + '<span id="am-pm">' + am_pm + '</span>';

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);

button.addEventListener('click', function () {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue.value + '&appid=' + key)
        .then(response => response.json())
        .then(data => {
            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            getWeatherData(latitude, longitude)
            countryEl.innerHTML = data.sys.country;
        }
        )
        .catch(err => alert("Wrong city name!"))
});

function getWeatherData(latitude, longitude) {
    fetch('http://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely&units=metric&appid=' + key)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            showWeatherData(data);
        })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezoneEl.innerHTML = data.timezone;

    currentWeatherItemsEl.innerHTML =
        '<div class="weather-item">' +
        '<div>Humidity</div>' +
        '<div>' + humidity + '%</div>' +
        '</div>' +
        '<div class="weather-item">' +
        '<div>Pressure</div>' +
        '<div>' + pressure + 'Pa</div>' +
        '</div>' +
        '<div class="weather-item">' +
        '<div>Wind Speed</div>' +
        '<div>' + wind_speed + 'm/s</div>' +
        '</div>' +
        '<div class="weather-item">' +
        '<div>Sunrise</div>' +
        '<div>' + window.moment(sunrise * 1000).format('HH:mm a') + '</div>' +
        '</div>' +
        '<div class="weather-item">' +
        '<div>Sunset</div>' +
        '<div>' + window.moment(sunset * 1000).format('HH:mm a') + '</div>' +
        '</div>';

    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + day.weather[0].icon + '@4x.png" alt="weather icon" class="w-icon">' +
                '<div class="other">' +
                '<div class="day">' + window.moment(day.dt * 1000).format('ddd') + '</div>' +
                '<div class="temp">Night - ' + day.temp.night + '°C</div>' +
                '<div class="temp">Day - ' + day.temp.day + '°C</div>' +
                '</div>';
        } else {
            otherDayForecast += '<div class="weather-forecast-item">' +
                '<div class="day">' + window.moment(day.dt * 1000).format('ddd') + '</div>' +
                '<img src="http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png" alt="weather icon" class="w-icon">' +
                '<div class="temp">Night - ' + day.temp.night + '°C</div>' +
                '<div class="temp">Day - ' + day.temp.day + '°C</div>' +
                '</div>'
                ;
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}