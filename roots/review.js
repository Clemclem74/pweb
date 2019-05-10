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
var Review = require('./../models/Review');
routeur.use(expressValidator());

routeur.get('/post_review/:id',(req,res) => {
        var review = new Review();
        res.render('review/post_review.html', {review:review , filmid:req.params.id});
});

routeur.post('/post_review/:id' , upload.none() , (req,res) => {
    if(!req.user) {
        res.render('user/signin.html');
    }
    const review = req.body.review;
    const idUser = req.user._id;
    const idFilm = req.params.id;


    req.checkBody('review','Un avis est obligatoire').notEmpty();

    let errors = req.validationErrors();
    if(errors){
        res.render('review/post_review.html' , {errors:errors});
    }
    else {
        let global_review = new Review({
            review:review,
            idUser:idUser,
            idFilm:idFilm,
        })
        
        global_review.save( (err) => {
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






module.exports = routeur;
