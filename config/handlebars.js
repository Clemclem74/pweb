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
    return new Handlebars.SafeString('checked');
  }
  else {
    return false;
  }
};


helpers.pagination = function(pages, current) {
  if (pages) {
    var str='';
    str=str+'<ul class="pagination text-center">'
      if (current == 1) {
          str=str+'<li class="disabled"><a>Début</a></li>'
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
          str=str+'">Dernier</a></li>'
      }
  str=str+'</ul>'
  return str;
  }
}


helpers.paginationsearch = function(pages, current) {
  if (pages) {
    var str='';
    str=str+'<ul class="pagination text-center">'
      if (current == 1) {
          str=str+'<li class="disabled"><a>Début</a></li>'
      }
      else { 
          str=str+'<li><a href="/search/1">Début</a></li>'
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
              str=str+'<li><a href="/search/'
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
          str=str+'<li><a href="/search/'
          str=str+pages 
          str=str+'">Dernier</a></li>'
      }
  str=str+'</ul>'
  return str;
  }
}



helpers.paginationrecommendation = function(pages, current) {
    if (pages) {
      var str='';
      str=str+'<ul class="pagination text-center">'
        if (current == 1) {
            str=str+'<li class="disabled"><a>Début</a></li>'
        }
        else { 
            str=str+'<li><a href="/recommend/list/1">Début</a></li>'
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
                str=str+'<li><a href="/recommend/list/'
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
            str=str+'<li><a href="/recommend/list/'
            str=str+pages 
            str=str+'">Dernier</a></li>'
        }
    str=str+'</ul>'
    return str;
    }
  }

 

  helpers.paginationtype = function(pages, current , typefilm) {
    if (pages) {
      var str='';
      str=str+'<ul class="pagination text-center">'
        if (current == 1) {
            str=str+'<li class="disabled"><a>Début</a></li>'
        }
        else { 
            str=str+'<li><a href="/typefilm/'
            str=str+typefilm
            str=str+'/1">Début</a></li>'
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
                str=str+'<li><a href="/typefilm/'
                str=str+typefilm
                str=str+'/'
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
            str=str+'<li><a href="/typefilm/'
            str=str+typefilm
            str=str+'/'
            str=str+pages 
            str=str+'">Dernier</a></li>'
        }
    str=str+'</ul>'
    return str;
    }
  }


  helpers.paginationgrade = function(pages, current) {
    if (pages) {
      var str='';
      str=str+'<ul class="pagination text-center">'
        if (current == 1) {
            str=str+'<li class="disabled"><a>Début</a></li>'
        }
        else { 
            str=str+'<li><a href="/bygrade/1">Début</a></li>'
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
                str=str+'<li><a href="/bygrade/'
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
            str=str+'<li><a href="/bygrade/'
            str=str+pages 
            str=str+'">Dernier</a></li>'
        }
    str=str+'</ul>'
    return str;
    }
  }
  

  helpers.myreview = function(idReview, idUser , idUserConnected) {
      str='';
      if (!(idUser < idUserConnected) && !(idUser>idUserConnected)) {
          str=str+'<br><a href="/review/edit/'
          str=str+idReview
          str=str+'">Modifiez votre comentaire</a>'
          return str
      }
      else {
           return str
      }
  }



module.exports = helpers