import { useState } from 'react';
import axios from 'axios';

const API_KEY = '8fa38f281321d715fec44173bbab2503';

function WeatherApp() {
  const [query, setQuery] = useState('');
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [showWeather, setShowWeather] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();

    const [geoData, geoError] = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`)
      .then((res) => [res, null])
      .catch((err) => [null, err]);

    if (geoError) return console.error(geoError.message);
    if (geoData.data.length === 0) return console.error('No results found');

    const { lat, lon } = geoData.data[0];
    const [weatherData, weatherError] = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pl`)
      .then((res) => [res, null])
      .catch((err) => [null, err]);

    if (weatherError) return console.error(weatherError);
    console.log(weatherData);
    setWeatherInfo(weatherData);
    setShowWeather(true);
  }

  const WeatherDetails = ({ weatherInfo }) => {
    return (
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Weather Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Temperature</h3>
            <p>{weatherInfo.data.main.temp}°C</p>
            <h3 className="text-lg font-semibold mb-2">Cloudiness</h3>
            <p>{weatherInfo.data.clouds.all}%</p>
            <h3 className="text-lg font-semibold mb-2">Humidity</h3>
            <p>{weatherInfo.data.main.humidity}%</p>
          </div>
          <div className="flex items-center justify-center">
            <img src={`http://openweathermap.org/img/w/${weatherInfo.data.weather[0].icon}.png`} alt="Weather Icon" className="h-16 w-16" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center h-screen">
      <div className='text-center'>
        <input value={query} onChange={(e) => setQuery(e.target.value)} type="text"
          className='bg-white rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:shadow-outline mb-4' placeholder="Enter city name" />
        <button onClick={fetchWeather}
          className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:shadow-outline'
        >Search</button>
      </div>
      {showWeather && <WeatherDetails weatherInfo={weatherInfo} />}
    </div>
  );
}

export default WeatherApp;
