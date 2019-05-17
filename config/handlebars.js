var Seen = require('./../models/seen');
var Handlebars = require('handlebars');
var filmseen_var=[];
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


function see(idFilm,idUser) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Seen.findOne({idUser:idUser , idFilm:idFilm}));
    }, 2000);
  });
}




 



/* return new Handlebars.SafeString('<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>');
 */
module.exports = helpers