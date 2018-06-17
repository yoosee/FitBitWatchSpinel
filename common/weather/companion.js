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
  const APIKEY = '40ed40883f0964911396ea2c04020029';
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
      const weather= {
        temperature: data["main"]["temp"],
        conditions: data["weather"][0]["main"],
        icon: data["weather"][0]["icon"],
      }
      console.log("Weather: " + weather.conditions);
      returnWeatherData(weather);
    });
  })
  .catch(function(err) {
    console.log("Error while fetching weather: " + err);
  });
};  

const fetchForecastOpenweather = (lat, lon) => {
  const APIKEY = '40ed40883f0964911396ea2c04020029';
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
      const n = 0; // n consists digit from 0 to 39, n * 3 hour ahead forecast
      const weather= {        
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
      console.log("Weather: " + weather.conditions);
      returnWeatherData(weather);
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
      console.log("Weather: " + weather.conditions);
      returnWeatherData(weather);
    });
  })
  .catch(function(err) {
    console.log("Error while fetching weather: " + err);
  });
};  

const returnWeatherData = (data) => {
  if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
};