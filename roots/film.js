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
const { ensureAdmin } = require('../config/admin');

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








routeur.get('/', (req,res) => {
    Film.find({}).populate('typeFilm').then(film => {
        res.render('film/list_film.hbs', {film: film });
})
});

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


routeur.get('/delete/:id', ensureAdmin, (req,res) => {
    Film.findOneAndRemove({ _id : req.params.id}).then(() => {
        res.redirect('/');
    })
});


routeur.get('/details/:id' , (req,res) => {
        Film.findById(mongoose.Types.ObjectId(req.params.id)).populate('typeFilm').then(film => {
            Review.find({idFilm : mongoose.Types.ObjectId(req.params.id)}).populate('idUser').then( list_review => {
                if(req.user){
                    See.find({idUser : mongoose.Types.ObjectId(req.user._id) , idFilm : mongoose.Types.ObjectId(req.params.id)}).then(see => {
                        var moyenne=0;
                        list_review.forEach((item, index, array) => {
                            moyenne = moyenne + item.grade;
                        })
                        moyenne=moyenne/list_review.length;
                        data={film:film, list_review:list_review , user:req.user , grade : moyenne , see : see};
                        res.render('film/details.hbs' , data);
                    })
                }
                else {
                    
                        var moyenne=0;
                        list_review.forEach((item, index, array) => {
                            moyenne = moyenne + item.grade;
                        })
                        moyenne=moyenne/list_review.length;
                        data={film:film, list_review:list_review , user:req.user , grade : moyenne };
                        res.render('film/details.hbs' , data);
                }
            })
        }),
        err => res.status(500).send(err);
})



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
    console.log(req.file);
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
    var picture = req.body.picture;
    if(req.file) {
        console.log("Picture détectée");
        picture=req.file.filename;
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
            film.picture=picture;
            

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

