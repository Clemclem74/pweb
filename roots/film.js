var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
routeur.use(expressValidator());
var Film = require('./../models/Film');
var TypeFilm = require('./../models/TypeFilm');
const { ensureAuthenticated } = require('../config/auth');
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
        res.render('film/list_film.html', {film: film});
})
});

routeur.get('/new',(req,res) => {
    TypeFilm.find({}).then(typefilm => {
        var film = new Film();
        res.render('film/new_movie.html', {film:film , typefilm:typefilm});
    })
});

routeur.get('/edit/:id',(req,res) => {
    TypeFilm.find({}).then(typefilm => {
        Film.findById(req.params.id).then(film => {
        res.render('film/edit_movie.html', {film:film , typefilm:typefilm });
        })
    })
});


routeur.get('/delete/:id', (req,res) => {
    Film.findOneAndRemove({ _id : req.params.id}).then(() => {
        res.redirect('/');
    })
});


routeur.get('/:id', ensureAuthenticated , (req,res) => {
        Film.findById(req.params.id).populate('typeFilm').then(film => {
            res.render('film/details.html',{film:film , test:req.user.name});
        }),
        err => res.status(500).send(err);
})

routeur.post('/new' , uploads.single('file'), (req,res) => {

    
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
            res.render('film/new_movie.html', {film:film , typefilm:typefilm, errors:errors});
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

routeur.post('/edit/:id' , (req,res) => {
    new Promise((resolve,reject) => {
        if (req.params.id)
            Film.findById(req.params.id).then(resolve,reject);
        
        else 
            resolve( new Film()); 
        
    }).then(film => {
        film.title = req.body.title;
        film.description = req.body.description;
        film.trailer = req.body.trailer;
        film.downlink = req.body.downlink;
        film.streamlink = req.body.streamlink;
        film.typeFilm = req.body.typeFilm;

        if(req.file) {
            film.picture=req.file.filename;
        }

        return film.save();
    }).then(() => {
        res.redirect('/');
    }, err => console.log(err));

})




module.exports = routeur;

