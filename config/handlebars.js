var Seen = require('./../models/seen');
var Handlebars = require('handlebars');

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
    return new Handlebars.SafeString('checked');
  }
  else {
    console.log("false")
    return false;
  }
};

helpers.seen = function(idFilm , idUser) {
  Seen.find({idFilm : idFilm , idUser : idUser}).then(seen => {
    if (seen.length) {
      console.log("vu detecté");
      return new Handlebars.SafeString('<h1>pute</h1>');
     // return new Handlebars.SafeString('<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>');
    }
    return ''
  })
}

module.exports = helpers