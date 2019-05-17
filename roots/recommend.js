var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var multer  = require('multer')
var bodyParser = require('body-parser');
const { ensureAuthenticated } = require('../config/auth');
routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var Recommend = require('./../models/recommend');
var Film = require('./../models/film');
var User = require('./../models/user');

routeur.use(expressValidator());

routeur.get('/list', ensureAuthenticated, (req,res) => {
    Recommend.find({idUserTo : req.user._id}).populate('idFilm').populate('idUserFrom').then(recommendList => {
        var data = [];
        for (i in recommendList) {
            data.push(recommendList[i]);
        }
        res.render('recommend/list_film.hbs', {film:data})
    })
});

routeur.get('/:id',(req,res) => {
        var recommend = new Recommend();
        User.find({}).then( Allusers => {
            Film.findById(req.params.id).then(film => {
                res.render('recommend/recommend.hbs', {recommend:recommend , film:film , Allusers : Allusers});
            })
        })
});


routeur.post('/:idFilm' , (req,res) => {
    if(!req.user) {
        res.render('user/signin.hbs');
    }

    const nameUserTo = req.body.nameUserTo;
    const idUserFrom = req.user._id;
    const idFilm = req.params.idFilm;


    req.checkBody('nameUserTo','Un autre utilisateur est obligatoire').notEmpty();
    let errors = req.validationErrors();
    

    if(errors){
        console.log(nameUserTo);
        res.render('recommend/recommend.hbs' , {errors:errors});
    }
    else {
        console.log("Success");
        User.findOne({username : nameUserTo}).then(user => {
            let recommend = new Recommend({
                idUserTo:user._id,
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
        })
        
    }

})






module.exports = routeur;
