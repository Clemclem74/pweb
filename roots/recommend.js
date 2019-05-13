var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var multer  = require('multer')
var bodyParser = require('body-parser');

routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var Recommend = require('./../models/recommend');
var User = require('./../models/user');

routeur.use(expressValidator());

routeur.get('/recommend/:id',(req,res) => {
        var recommend = new Recommend();
        res.render('recommend/recommend.hbs', {recommend:recommend , filmid:req.params.id});
});

routeur.post('/recommend/:id' , (req,res) => {
    if(!req.user) {
        res.render('user/signin.hbs');
    }

    console.log(req.body);
    const idUserTo = mongoose.Types.ObjectId(req.body.idUserTo);
    console.log(idUserTo);
    const idUserFrom = req.user._id;
    const idFilm = req.params.id;


    req.checkBody('idUserTo','Un autre utilisateur est obligatoire').notEmpty();
    let errors = req.validationErrors();
    console.log(User.findById(idUserTo));
    

    if(errors){
        res.render('recommend/recommend.hbs' , {errors:errors});
    }
    else {
        let recommend = new Recommend({
            idUserTo:idUserTo,
            idUserFrom:idUserFrom,
            idFilm:idFilm,
        })
        
        recommend.save( (err) => {
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
