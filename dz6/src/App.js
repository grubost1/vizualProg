import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  // API URL with dynamic location (Forecast API)
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=3eae247ac8253c29a610aea18396502b`;

  // Function to search for the location
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          setError('');
        })
        .catch((error) => {
          setError('Location not found. Please try again.');
          setData({});
        });
      setLocation('');
    }
  };

  // Helper function to get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Helper function to determine background style based on weather condition
  const getBackgroundStyle = () => {
    if (!data.list || !data.list[0]) return {};

    const main = data.list[0].weather[0].main.toLowerCase();
    switch (main) {
      case 'clear':
        return { backgroundImage: 'url(https://source.unsplash.com/random/?sunny)' };
      case 'clouds':
        return { backgroundImage: 'url(https://source.unsplash.com/random/?cloudy)' };
      case 'rain':
        return { backgroundImage: 'url(https://source.unsplash.com/random/?rain)' };
      case 'snow':
        return { backgroundImage: 'url(https://source.unsplash.com/random/?snow)' };
      default:
        return {};
    }
  };

  return (
    <div className="app" style={getBackgroundStyle()}>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
        {error && <p className="error">{error}</p>}
      </div>
      {data.city !== undefined && (
        <div className="container">
          <div className="header">
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}</p>
            <h1>{data.city.name}</h1>
            <div className="current-weather">
              <img src={getWeatherIcon(data.list[0].weather[0].icon)} alt={data.list[0].weather[0].main} />
              <span>+{data.list[0].main.temp.toFixed()}°C</span>
            </div>
          </div>
          <div className="hourly-forecast">
            <p>Hourly Forecast</p>
            <div className="forecast-items">
              {/* Display forecast for the next 5 intervals */}
              {data.list.slice(0, 5).map((forecast, index) => {
                const date = new Date(forecast.dt * 1000);
                const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                return (
                  <div className="forecast-item" key={index}>
                    <p>{time}</p>
                    <img src={getWeatherIcon(forecast.weather[0].icon)} alt={forecast.weather[0].main} />
                    <span>+{forecast.main.temp.toFixed()}°C</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="additional-info">
            <div className="info-item">
              <p>Humidity</p>
              <span>{data.list[0].main.humidity}%</span>
            </div>
            <div className="info-item">
              <p>Wind Speed</p>
              <span>{data.list[0].wind.speed.toFixed()} m/s</span>
            </div>
            <div className="info-item">
              <p>Air Pressure</p>
              <span>{data.list[0].main.pressure} hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;