const baseUrl = 'https://api.openweathermap.org/data/2.5';
const apiKey = '2a1bd24f3e8572521ea93fad8734140e';
function getCurrentWeather(cityid) {
    return fetch(`${baseUrl}/weather?id=${cityid}&appid=${apiKey}&units=metric`)
    .then(async response => await response.json())
    .catch(error => error);
}
function getFiveDayWeather(cityid) {
    return fetch(`${baseUrl}/forecast?id=${cityid}&appid=${apiKey}&units=metric`)
    .then(async response => await response.json())
    .catch(error => error);
}