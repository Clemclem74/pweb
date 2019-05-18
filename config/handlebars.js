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


helpers.pagination = function(pages, current) {
  if (pages) {
    var str='';
    str=str+'<ul class="pagination text-center">'
      if (current == 1) {
          str=str+'<li class="disabled"><a>First</a></li>'
      }
      else { 
          str=str+'<li><a href="/1">Début</a></li>'
      }
      var i = (Number(current) > 5 ? Number(current) - 4 : 1)
      if (i !== 1) { 
          str=str+'<li class="disabled"><a>...</a></li>'
      }
      for (; i <= (Number(current) + 4) && i <= pages; i++) { 
          if (i == current) {
              str=str+'<li class="active"><a>'
              str=str+i 
              str=str+'</a></li>'
          }
          else { 
              str=str+'<li><a href="/'
              str=str+i
              str=str+'">'
              str=str+i
              str=str+'</a></li>'
          }
          if (i == Number(current) + 4 && i < pages) {
              str=str+'<li class="disabled"><a>...</a></li>'
          } 
      }
      if (current == pages) { 
          str=str+'<li class="disabled"><a>Fin</a></li>'
      } else {
          str=str+'<li><a href="/'
          str=str+pages 
          str=str+'">Last</a></li>'
      }
  str=str+'</ul>'
  return str;
  }
}




 



/* return new Handlebars.SafeString('<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>');
 */
module.exports = helpers