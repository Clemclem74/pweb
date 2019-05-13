var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
routeur.use(expressValidator());
var Film = require('./../models/film');
var TypeFilm = require('./../models/typefilm');
var Review = require('./../models/review');
var User = require('./../models/user');
const { ensureAdmin } = require('../config/admin');

var path = require("path");
var multer = require('multer');




var storage = multer.diskStorage({ // initializing multer diskStorage to be able to keep the file original name and extension
    destination: './uploads',
    filename: function (req, file, cb)
    {
        cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + file.originalname);}
});

    
var uploads = multer({ storage: storage });









routeur.get('/', (req,res) => {
    Film.find({}).populate('typeFilm').then(film => {
        res.render('film/list_film.hbs', {film: film , user:req.user});
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


routeur.get('/:id' , (req,res) => {
        console.log(":id appelé");
        Film.findById(req.params.id).populate('typeFilm').then(film => {
            Review.find({idFilm : req.params.id}).populate('idUser').then( list_review => {
                var moyenne=0;
                list_review.forEach((item, index, array) => {
                    console.log(item.grade);
                    moyenne = moyenne + item.grade;
                    console.log(moyenne);
                })
                moyenne=moyenne/list_review.length;
            data={film:film, list_review:list_review , user:req.user , grade : moyenne};
            res.render('film/details.hbs' , data);
            })
        }),
        err => res.status(500).send(err);
})



routeur.post('/new' ,ensureAdmin , uploads.single('file'), (req,res) => {
    
    const title = req.body.title;
    const description = req.body.description;
    const trailer = req.body.trailer;
    const downlink = req.body.downlink;
    const streamlink = req.body.streamlink;
    const typeFilm = req.body.typeFilm;
    //const picture = req.body.picture;
    console.log(req.file);
    if(req.file) {
        console.log("Picture détectée");
        var picture=req.file.filename;
    }
    else {
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





routeur.post('/edit/:id' , ensureAdmin, uploads.single('file'), (req,res) => {

    
    const title = req.body.title;
    const description = req.body.description;
    const trailer = req.body.trailer;
    const downlink = req.body.downlink;
    const streamlink = req.body.streamlink;
    const typeFilm = req.body.typeFilm;
    //var picture = req.body.picture;
    console.log(req.file);
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
            film.description=description;
            film.trailer=trailer;
            film.downlink=downlink;
            film.streamlink=streamlink;
            film.typeFilm=typeFilm;
            if(req.file){
                film.picture=picture;
            }
            else {
                film.picture=film.picture;
            }
            

            console.log("film : " + film);
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

