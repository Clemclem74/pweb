var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var multer  = require('multer')
var upload = multer({ dest: '/uploads/' })
var bodyParser = require('body-parser');

routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var Seen = require('./../models/Seen');
routeur.use(expressValidator());


routeur.get('/seen/:id',(req,res) => {
    var seen = new Seen();
    res.render('review/post_review.hbs', {seen:seen , filmid:req.params.id});
});


routeur.post('/seen/:id' , upload.none() , (req,res) => {
    if(!req.user) {
        res.render('user/signin.hbs');
    }
    const idUser = req.user._id;
    const idFilm = req.params.id;


    let seen = new Seen({
        idUser:idUser,
        idFilm:idFilm,
    })
    
    seen.save( (err) => {
        if(err) {
            console.log(err);
            return
        }
        else {
            //res.redirect('/');
        }
    })
    

})






module.exports = routeur;
