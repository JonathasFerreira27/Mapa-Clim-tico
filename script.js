const apiKey = 'd16127ddfc074d6a060018359e44bbf3';
let currentMarker = null;

const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.on('click', async function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const weatherData = await getWeatherData(lat, lon);
    showWeatherInfo(weatherData, lat, lon);
});

async function getWeatherData(lat, lon) {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: { lat, lon, units: 'metric', appid: apiKey, lang: 'pt' }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        alert('Não foi possível obter os dados de clima.');
    }
}

function showWeatherInfo(data, lat, lon) {
    if (!data) return;

    const temperature = data.main.temp;
    const location = data.name || data.sys.country;
    const weatherDescription = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    currentMarker = L.marker([lat, lon]).addTo(map);
    currentMarker.bindPopup(`
        <div class="weather-popup">
            <div class="location">📍 ${location}</div>
            <div class="info">
                <div class="temperature">${temperature}°C</div>
                <img src="${iconUrl}" alt="Clima">
            </div>
            <div>${weatherDescription}</div>
        </div>
    `).openPopup();
}
