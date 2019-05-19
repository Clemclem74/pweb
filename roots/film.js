var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
routeur.use(expressValidator());
var Film = require('./../models/film');
var TypeFilm = require('./../models/typefilm');
var Review = require('./../models/review');
var See = require('./../models/seen');
var User = require('./../models/user');
var Recommend = require('./../models/recommend');
const { ensureAdmin } = require('../config/admin');
const methodOverride = require('method-override');
routeur.use(methodOverride('_method'));

var path = require("path");
/* var multer = require('multer');
 */

var bodyParser = require('body-parser');

routeur.use(bodyParser.urlencoded({
    extended: false
}));
routeur.use(bodyParser.json());

/* var storage = multer.diskStorage({ // initializing multer diskStorage to be able to keep the file original name and extension
    destination: './uploads',
    filename: function (req, file, cb)
    {
        cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + file.originalname);}
});
 

var uploads = multer({ storage: storage });
 */







async function gradefilm(idFilm) {
    const reviewlist = await Review.find({idFilm : idFilm})
    var moyenne=0;
    if (reviewlist.length) {
        for (i in reviewlist) {
            moyenne=moyenne+reviewlist[i].grade
        }
        moyenne=moyenne/reviewlist.length;
    }
    return moyenne;
}







routeur.get('/new', ensureAdmin ,(req,res) => {
    TypeFilm.find({}).then(typefilm => {
        var film = new Film();
        res.render('film/new_movie.hbs', {film:film , typefilm:typefilm});
    })
});

routeur.get('/edit/:id', ensureAdmin, (req,res) => {
    TypeFilm.find({}).then(typefilm => {
        Film.findById(req.params.id).then(film => {
        res.render('film/edit_movie.hbs', {film:film , typefilm:typefilm });
        })
    })
});

routeur.get('/adminsearch' , ensureAdmin , (req,res) => {
    Film.find({}).then(film => {
        res.render('user/searchadmin.hbs', {Allfilm:film});
    })
})



routeur.get('/bygrade/:page?' , async function(req,res) {
    var query = req.query.query || [];
    var perPage = 6;
    var page = req.params.page || 1;
    var data = []
    var sortfilm=[];
    film= await Film.find({})
    count=film.length;
    for await (i of film) {
        const reviewlist = await Review.find({idFilm : i._id})
        var moyenne=0;
        if (reviewlist.length) {
            for await (j of reviewlist) {
                moyenne=moyenne+j.grade
            }
            moyenne=moyenne/reviewlist.length;
        }
        grade = moyenne
        await sortfilm.push({film : i , grade : grade})
    }
    await sortfilm.sort(function (a, b) {
        return (a.grade < b.grade) ? 1 : -1;
    });
    var tmp = (perPage * page)-perPage
    if (req.user) {
        for (i = tmp; i < tmp+perPage; i++) {
            if(sortfilm[i]){
                const see = await See.find({idFilm : sortfilm[i].film._id, idUser:req.user._id })
                console.log(see);
                if (see.length) {
                    seen= '<img style="opacity: 0.7; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                    //seen='<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>'
                }
                else {
                    seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                }
                await data.push({seen:seen , film : sortfilm[i]});
            }
            
        }
        await res.render('film/list_film_grade.hbs', {data: data ,  current: page , pages: Math.ceil(count / perPage)});

    }
    else {
        for (i = tmp; i < tmp+perPage; i++) {
            if(sortfilm[i]){
                
                seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                
                await data.push({seen:seen , film : sortfilm[i]});
            }
            
        }
        await res.render('film/list_film_grade.hbs', {data: data ,  current: page , pages: Math.ceil(count / perPage)});

    }
})




routeur.post('/search/:page?', async function(req,res) {
    var query = req.query.query || [];
    var perPage = 6;
    var page = req.params.page || 1;
    if(req.user) {
        film=await Film.find({'title': {$regex: new RegExp('^' + req.body.search.toLowerCase(), 'i')}}).populate('typeFilm').sort('-releaseYear').skip((perPage * page)-perPage).limit(perPage)
        count = await Film.find({'title': {$regex: new RegExp('^' + req.body.search.toLowerCase(), 'i')}}).countDocuments();
        var data = [];
        for (i in film) {
            const see = await See.find({idFilm : film[i]._id, idUser:req.user._id })
            if (see.length) {
                seen= '<img style="opacity: 0.7; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                //seen='<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>'
            }
            else {
                seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
            }
            data.push({seen:seen , film : film[i]});
        }
    }
    else {
        film=await Film.find({'title': {$regex: new RegExp('^' + req.body.search.toLowerCase(), 'i')}}).populate('typeFilm').sort('-releaseYear').skip((perPage * page)-perPage).limit(perPage)
        count = await Film.find({'title': {$regex: new RegExp('^' + req.body.search.toLowerCase(), 'i')}}).countDocuments();
        var data = [];
        for (i in film) {
            seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
            data.push({seen:seen , film : film[i]});
        }
    }
   
    
    res.render('film/list_film_search.hbs', {data: data , search : req.body.search ,current: page , pages: Math.ceil(count / perPage)});
    
});

routeur.get('/details/:id' , (req,res) => {
    var query = req.query.query || [];
    var idFilm = req.params.id
    Film.findById(idFilm).populate('typeFilm').then(film => {
        Review.find({idFilm : mongoose.Types.ObjectId(idFilm)}).populate('idUser').then( list_review => {
            if(req.user){
                See.find({idUser : mongoose.Types.ObjectId(req.user._id) , idFilm : mongoose.Types.ObjectId(req.params.id)}).then(see => {
                    var moyenne=0;
                    list_review.forEach((item, index, array) => {
                        moyenne = moyenne + item.grade;
                    })
                    moyenne=moyenne/list_review.length;
                    data={film:film, list_review:list_review , user:req.user , grade : parseInt(moyenne) , see : see};
                    res.render('film/details.hbs' , data);
                })
            }
            else {
                
                    var moyenne=0;
                    list_review.forEach((item, index, array) => {
                        moyenne = moyenne + item.grade;
                    })
                    moyenne=moyenne/list_review.length;
                    data={film:film, list_review:list_review , user:req.user , grade : parseInt(moyenne) };
                    res.render('film/details.hbs' , data);
            }
        })
    }),
    err => res.status(500).send(err);
})


routeur.get('/:page?', async function(req,res) {
    var perPage = 6;
    var page = req.params.page || 1;
    var query = req.query.query || [];
    if(req.user) {
        film = await Film.find({}).populate('typeFilm').sort('-releaseYear').skip((perPage * page)-perPage).limit(perPage)
        count = await Film.countDocuments();
        
        var data = [];
        for (i in film) {
            const see = await See.find({idFilm : film[i]._id, idUser:req.user._id })
            if (see.length) {
                seen= '<img style="opacity: 0.7; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                //seen='<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>'
            }
            else {
                seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
            }
            data.push({seen:seen , film : film[i]});
        }
            res.render('film/list_film.hbs', {data: data , current: page , pages: Math.ceil(count / perPage)});
    }
    else {
        film = await Film.find({}).populate('typeFilm').sort('-releaseYear').skip((perPage * page)-perPage).limit(perPage)
        count = await Film.countDocuments();
        
        var data = [];
        for (i in film) {
            seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
            data.push({seen:seen , film : film[i]});
        }
            res.render('film/list_film.hbs', {data: data , current: page , pages: Math.ceil(count / perPage)});

    }

   
});


routeur.delete('/:id', ensureAdmin, async function(req,res) {
    await Film.findOneAndRemove({ _id : req.params.id})
    const seelist = await See.find({idFilm : req.params.id})
    for (i in seelist) {
        await Seen.findOneAndRemove({_id : seelist[i]._id})
    }
    const recommendlist = await Recommend.find({idFilm : req.params.id})
    for (i in recommendlist) {
        await Recommend.findOneAndRemove({_id : recommendlist[i]})
    }
    const reviewlist = await Review.find({idFilm : req.params.id})
    for (i in reviewlist) {
        await Review.findOneAndRemove({_id : reviewlist[i]})
    }           
    res.redirect('/');
});






routeur.post('/new' ,ensureAdmin ,  (req,res) => {
    
    const title = req.body.title;
    const description = req.body.description;
    const duration = req.body.duration;
    const releaseYear = req.body.releaseYear;
    const trailer = req.body.trailer;
    const downlink = req.body.downlink;
    const streamlink = req.body.streamlink;
    const typeFilm = req.body.typeFilm;
    var picture = req.body.picture;
    if (!req.body.picture){
        picture="not_found.png";
    }

    req.checkBody('title','Un titre est obligatoire').notEmpty();
    req.checkBody('description','Une description est obligatoire').notEmpty();
    req.checkBody('typeFilm','Type de film obligatoire').notEmpty();

    let errors = req.validationErrors();
    if(errors){
        TypeFilm.find({}).then(typefilm => {
            var film = new Film();
            res.render('film/new_movie.hbs', {film:film , typefilm:typefilm, errors:errors});
        })
    }
    else {
        let film = new Film({
            title:title,
            description:description,
            duration : duration,
            releaseYear : releaseYear,
            trailer:trailer,
            downlink:downlink,
            streamlink:streamlink,
            typeFilm:typeFilm,
            picture:picture,
        })
        film.save( (err) => {
            if(err) {
                console.log(err);
                return
            }
            else {
                res.redirect('/');
            }
        })
    } 
})





routeur.post('/edit/:id' , ensureAdmin, (req,res) => {

    
    const title = req.body.title;
    const description = req.body.description;
    const duration = req.body.duration;
    const releaseYear = req.body.releaseYear;
    const trailer = req.body.trailer;
    const downlink = req.body.downlink;
    const streamlink = req.body.streamlink;
    const typeFilm = req.body.typeFilm;
    if (req.body.picture) {
        var picture = req.body.picture;
    }
    else {
        picture=-1;
    }


    req.checkBody('title','Un titre est obligatoire').notEmpty();
    req.checkBody('description','Une description est obligatoire').notEmpty();
    req.checkBody('typeFilm','Type de film obligatoire').notEmpty();

    let errors = req.validationErrors();
    if(errors){
        TypeFilm.find({}).then(typefilm => {
            Film.findById(req.params.id).then(film => {
                res.render('film/edit_movie.hbs', {film:film , typefilm:typefilm, errors:errors});
            });  
        })
    }
    else {
        Film.findById(req.params.id).populate('TypeFilm').then(film => {
            film.title=title;
            film.duration = duration;
            film.releaseYear = releaseYear;
            film.description=description;
            film.trailer=trailer;
            film.downlink=downlink;
            film.streamlink=streamlink;
            film.typeFilm=typeFilm;
            if (picture != -1) {
                film.picture=picture;
            }
            else {
                film.picture=film.picture;
            }
            

            film.save( (err) => {
                if(err) {
                    console.log(err);
                    return
                }
                else {
                    res.redirect('/');
                }
            })
        })
        
    } 
})







module.exports = routeur;

