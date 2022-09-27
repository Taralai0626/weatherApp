import React, { useState, useEffect } from "react";
import axios from "axios";
 
// 1. SET STATE TO TORONTO
// 2. INVOKE USEEFFECT ON RENDER
// 3. CALL LOADLOCATION WITH THE DEFAULT STATE -> Toronto
// 4. SEARCHLOCATION CALLS LOADLOCATION WITH NEW STATE ON 'ENTER'
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
 
  const loadLocation = () => {
    const urlOne = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
    const urlTwo = `https://api.pexels.com/v1/search?query=${location}&per_page=1`;
 
    const requestOne = axios.get(urlOne)
    const requestTwo = axios.get(urlTwo, {
      headers: {
        'Authorization': process.env.REACT_APP_PEXELS_KEY
      }
    });
 
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0].data;
          const responseTwo = responses[1].data;

          // use/access the results
          console.log(responseOne);
          console.log(responseTwo);
          setWeather(responseOne)
          setPexels(responseTwo)
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
      {weatherData.list[0].weather ? <div className={weatherData.list[0].weather[0].main}></div> : null }
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
            {weatherData.city ? <p>{weatherData.city.name}</p> : null}
          </div>
          <div className="temp">
            {/* {weatherData.main ? <h1>{weatherData.main.temp.toFixed()}°C</h1> : null} */}
            {weatherData.list[0] ? <h1>{weatherData.list[0].main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {weatherData.list[0].weather ? <img alt="weather icon" src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`} /> : null}
            {weatherData.list[0].weather ? <p>{weatherData.list[0].weather[0].main}</p> : null}
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            {weatherData.list[0].main ? <p className="bold">{weatherData.list[0].main.feels_like.toFixed()}°F</p> : null}
            <p>Feels Like</p>
          </div>
          <div className="humidity">
            {weatherData.list[0].main ? <p className="bold">{weatherData.list[0].main.humidity}%</p> : null}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {weatherData.list[0].main ? <p className="bold">{weatherData.list[0].wind.speed.toFixed()} MPH</p> : null}
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default App;