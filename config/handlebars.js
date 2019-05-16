//Convertion clock
const { format }  = require('helper-timeago');

const helpers = {}

helpers.timeago = (timestamp) =>{
  return format(timestamp, 'fr_FR')
}


helpers.math = function(lvalue, operator, rvalue, options) {
  lvalue = parseInt(lvalue);
  rvalue = parseInt(rvalue);
      
  return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": parseInt(lvalue / rvalue),
      "%": lvalue % rvalue
  }[operator];
};

helpers.checked = function(film,idType) {
  if (film.typeFilm.indexOf(idType) != -1) {
    console.log("true")
    return "ckecked";
  }
  else {
    console.log("false")
    return false;
  }
};

module.exports = helpers