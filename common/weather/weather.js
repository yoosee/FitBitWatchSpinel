import * as messaging from "messaging";

export default class Weather {
  constructor() {
    let temperature = undefined;
    let conditions  = undefined;   
    let icon = undefined;   
    
    let info = {};
    let current = undefined;
    let forecast = undefined;
    
    let updated_at  = undefined;
    let is_success  = undefined;
    
    this.onsuccess = undefined;
    this.onerror   = undefined;
    
    if(this.onsuccess) this.onsuccess(evt.data); 
  }
  
  // send message to Companion to fetch updating weather information
  fetch() {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      console.log("sending message: weather");
      messaging.peerSocket.send({
        command: 'weather'
      });
    } else {
      console.log("messaging.peerSocket.readyState couldn't be OPEN.");
    }
  }
  
  // set weather information from 'data' received. 

  update(data) {      
    if(data && data.current) {
      this.current  = data.current;
      console.log(`update current temperature: ${data.current.temperature} and conditions: ${data.current.conditions}`);
      this.temperature = data.current.temperature ? data.current.temperature : "-";
      this.conditions  = data.current.conditions ? data.current.conditions : "Loading...";
      this.icon = data.current.icon ? data.current.icon : "unknown";
      this.updated_at  = new Date;
      this.is_success  = data.current.conditions ? true : false;    
    }  
    if(data && data.forecast) {
      console.log(`update forecast temperature: ${data.forecast.temperature} and conditions: ${data.forecast.conditions}`);
        this.forecast = data.forecast;        
      this.updated_at  = new Date;        
      this.is_success  = data.forecast.conditions ? true : false;
    }
  }
};

//setInterval(fetch, 30*1000*60);