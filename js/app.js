const RecentSearch = 'Recent-Search';
const debounceded = _.debounce(() => searchCities(event), 1000);

function handelInputChange(event) {
    debounceded();
}

function checkedInformation() {
    const searchInputElement = document.getElementById('inputMain');
    const InfoMain = document.querySelector('.infoMain');
    if (searchInputElement.value == '') {
        InfoMain.classList.remove('display-b');
        InfoMain.classList.add('display-n');
    } else {
        InfoMain.classList.remove('display-n');
    }
}

window.onload = checkedInformation();


async function searchCities(event) {
    const searchInputElement = document.getElementById('inputMain');
    const foundedCities = await getCities(searchInputElement.value);
    const searchElement = document.getElementsByClassName('search')[0];
    const suggestionElement = document.getElementsByClassName('Suggestion')[0];
    suggestionElement.classList.add('d-block');
    toggelSuggestion(searchInputElement.value.length)
    if (foundedCities.length) {
        loadSuggestions(foundedCities);
        setRecentSearch(foundedCities);
    } else {
        const emptyElement = `<div class="empty-massage"><span> "${event.target.value}"  is not founded . . . </span></div>`
        suggestionElement.innerHTML = emptyElement;
    }
}

function handelInputBlur() {
    setTimeout(() => toggelSuggestion(false), 3000);
}

function handelInputFocus() {
    const recentCities = JSON.parse(localStorage.getItem(RecentSearch));
    if (recentCities && recentCities.length) {
        loadSuggestions(recentCities);
        toggelSuggestion(true);
    }
}

function loadSuggestions(Cities) {
    const suggestionElement = document.getElementsByClassName('Suggestion')[0];
    const items = document.getElementsByClassName('search-items')[0];
    // let items = `<ul class="search-items">`;
    items && items.remove();
    const ul = document.createElement('ul');
    ul.classList.add('search-items');
    Cities.forEach(city => {
        // const itemElement = `<li class="search-item" onclick="clickCity()">${city.name}</li>`
        const itemElement = document.createElement('li');
        itemElement.classList.add('search-item');
        itemElement.onclick = () => clickCity(city);
        itemElement.innerText = city.name;
        ul.appendChild(itemElement);
        // items += itemElement;
    });
    // items += `</ul>`
    // suggestionElement.innerHTML = items;
    suggestionElement.appendChild(ul);
}

function toggelSuggestion(isShow) {
    const suggestionElement = document.getElementsByClassName('Suggestion')[0];
    isShow ?
        suggestionElement.classList.add('d-block') :
        suggestionElement.classList.remove('d-block')
    !isShow && (() => {
        suggestionElement.innerHTML = ''
    })();
}

function setRecentSearch(cities) {
    let data = cities.slice(0, 4);
    data = JSON.stringify(data);
    localStorage.setItem(RecentSearch, data);
}


async function clickCity(city) {
    const suggestionElement = document.getElementsByClassName('Suggestion')[0];
    let inputMain = document.getElementById('inputMain');
    const mainTxt = document.getElementById('mainTxt');

    inputMain.value = city.name;
    suggestionElement.innerText = '';
    const response = await getCurrentWeather(city.id);
    changeInfo(response);
    const responses = await getFiveDayWeather(city.id);
    change5DayInfo(responses);

}

async function changeInfo(weather) {
    const mainCity = document.querySelector('#mainTxt');
    const timeCity = document.querySelector('#timeTxt');
    const humidityCity = document.querySelector('#humidity');
    const windSpeedCity = document.querySelector('#windSpeed');
    const pressureCity = document.querySelector('#pressure');
    const degCity = document.querySelector('.degInfoMain');
    const iconSrc = document.querySelector('.iconSrc');
    const InfoMain = document.querySelector('.infoMain');
    InfoMain.classList.remove('display-n');
    console.log(weather);
    degCity.innerText = `${Math.round(weather.main.temp)} ℃`;
    iconSrc.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    console.log(weather.weather[0].icon);
    mainCity.innerText = `${weather.name},  "${weather.sys.country}"`;
    timeCity.innerText = moment(weather.dt, 'X').format('dddd');
    humidityCity.innerText = `${weather.main.humidity} %`;
    windSpeedCity.innerText = `${weather.wind.speed} m/s`
    pressureCity.innerText = `${weather.main.pressure} hPa`
}

async function change5DayInfo(weather) {
    console.log(weather);
    console.log(weather.list.length);
    const mainItem = document.querySelector('#infoWeek');
    if (mainItem.innerHTML.trim() == '') {
        for (let i = 0; i < 40; i) {
            let itemsLi = document.createElement('li');
            let itemFigure = document.createElement('figure');
            let itemPara = document.createElement('p');
            let itemspan = document.createElement('span');
            let itemimg = document.createElement('img');
            console.log(i);
            mainItem.appendChild(itemsLi);
            itemsLi.classList.add('itemInfoWeek');
            itemsLi.appendChild(itemFigure);
            itemsLi.appendChild(itemPara);
            itemsLi.appendChild(itemspan);
            itemFigure.appendChild(itemimg);
            itemPara.innerText = moment(weather.list[i].dt, 'X').format('dddd');
            itemspan.innerText = `${Math.round(weather.list[i].main.temp)} ℃`;
            itemimg.src = `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`
            i = i + 8;
        }
    } else {
        console.log(mainItem.innerHTML)
        mainItem.innerHTML = '';
        console.log(mainItem.innerHTML)
        change5DayInfo(weather);
    }

}