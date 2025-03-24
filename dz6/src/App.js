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
        //return { backgroundImage: 'url(https://source.unsplash.com/random/?sunny)' };
        return { backgroundImage: 'url(https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' };
      case 'clouds':
        return { backgroundImage: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1951&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' };
      case 'rain':
        return { backgroundImage: 'url(https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' };
      case 'snow':
        return { backgroundImage: 'url(https://images.unsplash.com/photo-1704642720431-6053974f40d7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' };
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