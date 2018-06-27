/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import { preferences } from "user-settings";

import { days, months, monthsShort } from "./locales/en.js";
import * as util from "../../common/utils";

let dateFormat, clockCallback;

export function initialize(granularity, callback) {
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

function tickHandler(evt) {
  let n = evt.date;  
  //let n = new Date();
  let hours = n.getHours() % 12;
  let mins = n.getMinutes();
  let secs = n.getSeconds();

  let dateText = ["SUN","MON","TUE","WED","THU","FRI","SAT"][n.getDay()] + "  " + n.getDate();

  clockCallback({dateText: dateText, 
                 digitalClock: digitalClock(hours, mins, secs),
                });
}

// Returns an angle (0-360) for the current hour in the day, including minutes
const digitalClock = (hours,mins,secs) => {
  let t = `${util.monoDigits(util.zeroPad(hours))}:${util.monoDigits(util.zeroPad(mins))}`;
  return t;  
};