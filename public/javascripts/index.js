const weather = {
    Sun: 'weather.sun',
    Cloud: 'weather.cloud',
    Suncloud: 'weather.suncloud',
    Rain: 'weather.rain'
};

Date.prototype.getWeekDay = function() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[this.getDay()];
}

let buildDayWeatherHtml = (date, temperature, pop) => {
    const weatherTemplate = {
        [weather.Sun]: `
          <h3>${date}</h3>
          <svg viewbox="-50 -50 100 100">
            <circle cx="0" cy="0" r="22" class="sun"></circle>
          </svg>
          <h3 class="temperature">${temperature}℃</h3>
        `,
        [weather.Cloud]: `
          <h3>${date}</h3>
          <svg viewbox="-50 -50 100 100">
            <circle cx="0" cy="30" r="20" class="cloud"></circle>
            <circle cx="-15" cy="30" r="20" class="cloud"></circle>
            <circle cx="-30" cy="30" r="20" class="cloud"></circle>
            <circle cx="-25" cy="10" r="15" class="cloud"></circle>
            <circle cx="-7" cy="15" r="15" class="cloud"></circle>
          </svg>
          <h3 class="temperature">${temperature}℃</h3>
        `,
        [weather.Suncloud]: `
          <h3>${date}</h3>
          <svg viewbox="-50 -50 100 100">
            <circle cx="0" cy="0" r="22" class="sun"></circle>
            <circle cx="0" cy="30" r="20" class="cloud"></circle>
            <circle cx="-15" cy="30" r="20" class="cloud"></circle>
            <circle cx="-30" cy="30" r="20" class="cloud"></circle>
            <circle cx="-25" cy="10" r="15" class="cloud"></circle>
            <circle cx="-7" cy="15" r="15" class="cloud"></circle>
          </svg>
          <h3 class="temperature">${temperature}℃</h3>
        `,
        [weather.Rain]: `
          <h3>${date}</h3>
          <svg viewbox="-50 -50 100 100">
            <line x1="-25" y1="15" x2="-25" y2="35" class="rain"></line>
            <line x1="-14" y1="5" x2="-14" y2="25" class="rain"></line>
            <line x1="-5" y1="20" x2="-5" y2="45" class="rain"></line>
            <circle cx="0" cy="30" r="20" class="cloud"></circle>
            <circle cx="-15" cy="30" r="20" class="cloud"></circle>
            <circle cx="-30" cy="30" r="20" class="cloud"></circle>
            <circle cx="-25" cy="10" r="15" class="cloud"></circle>
            <circle cx="-7" cy="15" r="15" class="cloud"></circle>
          </svg>
          <h3 class="temperature">${temperature}℃</h3>
        `
    }
    switch (Math.floor(pop/25)) {
        case 0:
            return weatherTemplate[weather.Sun]
        case 1:
            return weatherTemplate[weather.Suncloud]
        case 2:
            return weatherTemplate[weather.Cloud]
        case 3:
        case 4:
            return weatherTemplate[weather.Rain]
    }
};


const renderBoard = (weather) => {
    let nodes = document.getElementsByClassName("dayweather");
    for (let i = 0 ; i < nodes.length ; i++) {
        if (weather[i].pop != " ") {
            nodes[i].innerHTML = buildDayWeatherHtml(weather[i].date, weather[i].t, weather[i].pop);
        } else {
            nodes[i].innerHTML = buildDayWeatherHtml(weather[i].date, weather[i].t, 0);
        }
    }
};

const fetchWeather = async () => {
    const apiUrl = 'http://localhost:3000/weather'
    let response = await fetch(apiUrl);
    return await response.json();
};

(async () => {
    let weather = await fetchWeather()
    renderBoard(weather)
})();
