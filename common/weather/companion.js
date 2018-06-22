import * as messaging from "messaging";
import { geolocation } from "geolocation";

// import and create Weather class in companion/index.js to start weather companion process.
// import Weather from '../common/weather/companion';
// let weather = new Weather;

export default class Weather {  
  constructor() {    
    messaging.peerSocket.addEventListener("message", (evt) => {
      if (evt.data !== undefined && evt.data.command == "weather") {
        getWeather();
      }
    });
  }
}

const getWeather = () => {
  let n = new Date;
  console.log('Updating Weather from companion and calling geolocation at ' + n);
  geolocation.getCurrentPosition(locationSuccess, locationError);
};

const locationSuccess = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherOpenweather(lat, lon);
  console.log("Position: " + lat + ", " + lon);
};

const locationError = (error) => {
  console.log("locationError: " + error.code + " => " + error.message);
}

const fetchWeatherOpenweather = (lat, lon) => {
  let weather = {};
  const promise = new Promise((resolve,reject) => {
    let current = fetchCurrentOpenweather(lat, lon);
    let forecast = fetchForecastOpenweather(lat, lon);
    if(current !== undefined && forecast !== undefined) {
      weather = {      
        current: current,       
        forecast: forecast        
      };          
      resolve(weather);
    }
  });
  Promise.all(promise).then(returnWeatherData(weather));
};

const fetchCurrentOpenweather = (lat, lon) => {
  const APIKEY = 'c6c48ae1e6825a5819982b2390e9b577';
  const ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather?units=metric';
  let url = ENDPOINT + '&lat=' + lat + '&lon=' + lon + '&appid=' + APIKEY;
  console.log('Calling OpenWeather.org weather API: ' + url);  
  fetch(url)
  .then(function(response){
    if(response.ok) {    
      console.log("response ok");  
    }    
    response.json()
    .then(function(data) {
     let current = {
        temperature: data["main"]["temp"],
        conditions: data["weather"][0]["main"],
        icon: data["weather"][0]["icon"],
      }
      console.log("Weather: " + current.conditions);
      let w = { current: current };      
      returnWeatherData(w);
      return current;
    });
  })
  .catch(function(err) {
    console.log("Error while fetching weather: " + err);
  });
};  

const fetchForecastOpenweather = (lat, lon) => {
  const APIKEY = 'c6c48ae1e6825a5819982b2390e9b577';
  const ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast?units=metric';
  let url = ENDPOINT + '&lat=' + lat + '&lon=' + lon + '&appid=' + APIKEY;
  console.log('Calling OpenWeather.org forecast API: ' + url);  
  fetch(url)
  .then(function(response){
    if(response.ok) {    
      console.log("response ok");  
    }    
    response.json()
    .then(function(data) {
      const n = 3; // n consists digit from 0 to 39, n * 3 hour ahead forecast
      let forecast = {        
        temperature: data["list"][n]["main"]["temp"],
        temp_max: data["list"][n]["main"]["temp_max"],
        temp_min: data["list"][n]["main"]["temp_min"],
        humidity: data["list"][n]["main"]["humidity"],
        pressure: data["list"][n]["main"]["puressure"],
        conditions: data["list"][n]["weather"][0]["main"],
        icon: data["list"][n]["weather"][0]["icon"],
        windspeed: data["list"][n]["wind"]["speed"],
        winddeg: data["list"][n]["wind"]["deg"],
        rain: data["list"][n]["rain"]["3h"], // rain volume for last 3 hours, mm, could be empty
        snow: data["list"][n]["rain"]["3h"], // snow volume for last 3 hours, mm, could be empty
      }
      console.log("Forecast: " + forecast.conditions);
      let w = { forecast: forecast };
      returnWeatherData(w);
      return forecast;
    });
  })
  .catch(function(err) {
    console.log("Error while fetching weather: " + err);
  });
};  

const fetchWeatherUnderground = (lat, lon) => {
  const APIKEY = '';
  
  console.log('Calling OpenWeather.org API');
  const url = 'http://api.wunderground.com/api/' + APIKEY + '/conditions/astronomy/q/' + lat + ',' + lon + '.json';
  fetch(url)
  .then(function(response){
    response.json()
    .then(function(data) {
      const weather= {
        temperature: data["current_observation"]["temp_c"],
        conditions: data["current_observation"]["weather"]
      }
//      console.log("Weather: " + weather.conditions);
      returnWeatherData(weather);
    });
  })
  .catch(function(err) {
    console.log("Error while fetching weather: " + err);
  });
};  

const returnWeatherData = (data) => {
  if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log("Sending weather to the device: " + JSON.stringify(data));
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
};