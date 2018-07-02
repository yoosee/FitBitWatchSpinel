// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Convert a number to a special monospace number
export function monoDigits(digits) {
  var ret = "";
  var str = digits.toString();
  for (var index = 0; index < str.length; index++) {
    var num = str.charAt(index);
    ret = ret.concat(hex2a("0x1" + num));
  }
  return ret;
}

// temperature unit (C to F or C to C)
export const ctof = (c, unit) => {
  if(unit === "F") {
    return (c * 9.0 / 5.0 + 32);
  }
  //return Math.round(c, 1);
  return c;
};

// Hex to string
export function hex2a(hex) {
  var str = '';
  for (var index = 0; index < hex.length; index += 2) {
    var val = parseInt(hex.substr(index, 2), 16);
    if (val) str += String.fromCharCode(val);
  }
  return str.toString();
}

export const truncateText = (t, max) => {
  //truncatedText = t.substring(0, Math.min(max,t.length));
  if (t.length <= max) {
    return t;
  } else {    
    return t.substring(0,(max-2)) + ".."
  }
}

export const round = (number, precision) => {
  var shift = function (number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }  
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
};