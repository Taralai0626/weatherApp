import React, { useState, useEffect } from "react";
import axios from "axios";
 
// 1. SET STATE TO TORONTO
// 2. INVOKE useEffect ON RENDER
// 3. CALL loadLocation WITH THE DEFAULT STATE -> Toronto
// 4. searchLocation CALLS loadLocation WITH NEW STATE ON 'ENTER'
const App = () => {
  const [weatherData, setWeather] = useState({})
  const [pexelsData, setPexels] = useState({})
  // Set state to a string for the location, with a default of 'Toronto'
  const [location, setLocation] = useState('Toronto')
  
 
  // call API functions on component render/load
  useEffect(() => {
    loadLocation();
  }, [])
 
  // Load new results on state change
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      loadLocation();
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
 
  const loadLocation = () => {
    const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
    const pexelsAPI = `https://api.pexels.com/v1/search?query=${location}&per_page=1`;
 
    const getWwatherData = axios.get(weatherAPI)
    const getPexelsData = axios.get(pexelsAPI, {
      headers: {
        'Authorization': process.env.REACT_APP_PEXELS_KEY
      }
    });
 
    axios
      .all([getWwatherData, getPexelsData])
      .then(
        axios.spread((...responses) => {
          const fetchWeatherData = responses[0].data;
          const fetchPexelsData = responses[1].data;

          // use/access the results
          console.log(fetchWeatherData);
          console.log(fetchPexelsData);
          setWeather(fetchWeatherData)
          setPexels(fetchPexelsData)
        })
      )
      .catch(errors => {
        // react on errors.
        console.error(errors);
      })
  }

 

  return (
    <div className="app">
      {pexelsData.photos ? <img className="bag-image" alt={pexelsData.photos[0].alt} src={pexelsData.photos[0].src.original} /> : null}
      {weatherData.list ? <div className={weatherData.list[0].weather[0].main}></div> : null }
      <div className="search">
        <input
          // value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            {/* <p>{weatherData.name}</p> */}
            {weatherData.city ? <p>{weatherData.city.name}, {weatherData.city.country}</p> : null}
          </div>
          <div className="date">{dateBuilder(new Date())}</div>
          <div className="temp">
            {/* {weatherData.main ? <h1>{weatherData.main.temp.toFixed()}°C</h1> : null} */}
            {weatherData.list ? <h1>{weatherData.list[0].main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description"> 
            {weatherData.list ? <img alt="weather icon" src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`} /> : null}
            {weatherData.list ? <p>{weatherData.list[0].weather[0].main}</p> : null}
          </div>
          <div className="forecast-title">
            <p>FORECAST:</p>
          </div>
          <div className="forecast">
            
            {weatherData.list !== undefined && weatherData.list.map(weather=> ( 
              <div className="forecast-Data">
                <h2>{weather.dt_txt.substring(11,16)}</h2>
                <img alt="weather icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} />
                <p>{weather.main.temp.toFixed()}°C</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            {weatherData.list ? <p className="bold">{weatherData.list[0].main.feels_like.toFixed()}°F</p> : null}
            <p>Feels Like</p>
          </div>
          <div className="humidity">
            {weatherData.list ? <p className="bold">{weatherData.list[0].main.humidity}%</p> : null}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {weatherData.list ? <p className="bold">{weatherData.list[0].wind.speed.toFixed()} MPH</p> : null}
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
 
export default App;