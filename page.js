document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.querySelector('.snow');
    const numberOfFlakes = 100; // Nombre de flocons
  
    for (let i = 0; i < numberOfFlakes; i++) {
      const flake = document.createElement('div');
      const size = Math.random() * 5 + 2; // Taille aléatoire entre 2px et 7px
      const position = Math.random() * 100; // Position horizontale aléatoire
      const duration = Math.random() * 5 + 5; // Durée d'animation entre 5s et 10s
      const delay = Math.random() * 5; // Délai aléatoire entre 0s et 5s
  
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${position}vw`;
      flake.style.animationDuration = `${duration}s`;
      flake.style.animationDelay = `${delay}s`;
  
      snowContainer.appendChild(flake);
    }
    const themeToggle = document.getElementById('theme-toggle');
    
    // Fonction pour changer l'image de fond
    function changeBackground() {
        if (themeToggle.checked) {
            // Mode nuit
            document.body.style.backgroundImage = "url('images/bgNuit1.jpg')";
        } else {
            // Mode jour
            document.body.style.backgroundImage = "url('images/bg1.jpg')";
        }
    }

    // Vérifier l'état du switch et appliquer l'image au chargement
    changeBackground();

    // Ajouter un écouteur d'événements au switch
    themeToggle.addEventListener('change', () => {
        changeBackground(); // Changer l'image de fond selon le switch
    });
    const cityInput = document.querySelector('.city-input');
    const searchBtn = document.querySelector('.search-btn');
    const notFoundSection = document.querySelector('.not-found');
    const searchCitySection = document.querySelector('.search-city');
    const weatherInfoSection= document.querySelector('.weather-info');

    const countryTxt = document.querySelector('.country-text');
    const tempTxt = document.querySelector('.temp-txt');
    const conditionTxt = document.querySelector('.condition-txt');
    const humidityValueTxt = document.querySelector('.humidity-value-txt');
    const windValueTxt = document.querySelector('.wind-value-txt');
    const weatherSummaryImg = document.querySelector('.weather-summary-image');
    const currentDateTxt = document.querySelector('.current-date-txt');
    const forecastItemsContainer =document.querySelector('.forecast-items-container');

    const apiKey = 'a522b18925882a8f1eb1c5c4931c70bb';
    searchBtn.addEventListener('click', () => {
        if (cityInput.value.trim() != "") {
            updateWeatherInfo(cityInput.value);
            cityInput.value="";
            cityInput.blur();
        }
    });
    cityInput.addEventListener('keydown',(event)=>{
        if(event.key == 'Enter' && cityInput.value.trim() != ""){
            updateWeatherInfo(cityInput.value);
            cityInput.value="";
            cityInput.blur();
        }
        
    })
    async function getFetchData(endPoint, city){
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        return response.json();
    }

    function getWeatherIcon(id){
        if (id <= 232) return 'thunderstorm.svg';
        if (id <= 321) return 'drizzle.svg';
        if (id <= 531) return 'rain.svg';
        if (id <= 622) return 'snow.svg';
        if (id <=781) return 'atmosphere.svg';
        if (id <= 800) return 'clear.svg';
        else return 'clouds.svg';
 
    }
    function getCurrentDate(){
        const currentDate = new Date();
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        }
        return currentDate.toLocaleDateString('en-GB', options);
    }
    async function updateWeatherInfo(city){
        const weatherData = await getFetchData('weather',city);
        if (weatherData.cod != 200){
            showDisplaySection(notFoundSection);
            retun
        }
        const{
            name: country,
            main: { temp, humidity},
            weather: [{id, main}],
            wind: {speed}
        }=weatherData;
        countryTxt.textContent = country;
        tempTxt.textContent =Math.round(temp) + ' °C';
        conditionTxt.textContent = main;
        humidityValueTxt.textContent = humidity + '%';
        windValueTxt.textContent = speed + ' M/s';
        weatherSummaryImg.src = `images/weather/${getWeatherIcon(id)}`;
        currentDateTxt.textContent = getCurrentDate();

        await updateForecastsInfo(city);
        showDisplaySection(weatherInfoSection);
    }
    async function updateForecastsInfo(city){
        const forecastsData = await getFetchData('forecast',city);
        const timeTaken = '12:00:00';
        const todayDate = new Date().toISOString().split('T')[0];
        forecastItemsContainer.innerHTML = '';
        forecastsData.list.forEach(forecastWeather => {
            if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
                updateForecastsItems(forecastWeather);

            }
        });
    }
    function updateForecastsItems(weatherData){
        const{
            dt_txt: date,
            weather: [{id}],
            main: {temp}
        }= weatherData;
        const dateTaken = new Date(date);
        const dateOption = {
            day: '2-digit',
            month: 'short'
        }
        const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)
        const forecast=`
                    <div class="forecast-item">
                        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                        <img src="images/weather/${getWeatherIcon(id)}" class="forecast-item-image"/>
                        <h5 class="forecast-item-temp">${Math.round(temp)}</h5>
                    </div>
        `;
        forecastItemsContainer.insertAdjacentHTML('beforeend', forecast);

    }
    function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(section => {
        section.style.display = 'none'; // Utilisation correcte de style.display
    });
    section.style.display = 'flex'; // Affiche la section ciblée
}

});
