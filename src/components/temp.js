import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [weatherData, setWeather] = useState({})
  const [pexelsData, setPexels] = useState({})
  const [location, setLocation] = useState('')
  
  
  const searchLocation = (event) =>{
    if (event.key === 'Enter'){
    const one = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=e3dd5bf3c7eb769e342ba56558ac750b&units=metric`
    const two = `https://api.pexels.com/v1/search?query=${location}&per_page=1`;
    const access_token = '563492ad6f917000010000014060d806c66c47b88b9b4d7f8c487692'  

    const requestOne = axios.get(one)
    const requestTwo = axios.get(two, {  
      headers: {  
          'Authorization': `${access_token}`  
      }});

      axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0].data;
          const responseTwo = responses[1].data;
    
          // use/access the results
          console.log(responseOne, responseTwo);
          setWeather(responseOne)
          setPexels(responseTwo)
        })
      )
      .catch(errors => {
        // react on errors.
        console.error(errors);
      })
    }}
    useEffect(() =>{
      setLocation('')
    },[])
  
  return (
    <div className="app">
      {pexelsData.photos ? <img alt={pexelsData.photos[0].alt} src={pexelsData.photos[0].src.original} /> : null }
      <div className="search">
        <input 
        value={location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder="Enter Location"
        type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{weatherData.name}</p>
          </div>
          <div className="temp">
            {weatherData.main ? <h1>{weatherData.main.temp.toFixed()}°C</h1> : null }
          </div>
          <div className="description">
            {weatherData.weather ? <img alt="weather icon"src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} /> : null }
            {weatherData.weather ? <p>{weatherData.weather[0].main}</p> : null }
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            {weatherData.main ? <p className="bold">{weatherData.main.feels_like.toFixed()}°F</p> : null }
            <p>Feels Like</p>
          </div>
          <div className="humidity">
            {weatherData.main ? <p className="bold">{weatherData.main.humidity}%</p> : null }
            <p>Humidity</p>
          </div>
          <div className="wind">
            {weatherData.main ? <p className="bold">{weatherData.wind.speed.toFixed()} MPH</p>: null }
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
