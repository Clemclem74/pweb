var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var multer  = require('multer')
//var upload = multer({ dest: '/uploads/' })
var bodyParser = require('body-parser');
var passport  = require('passport')
const { ensureAuthenticated } = require('../config/auth');
const { ensureNotAuthenticated } = require('../config/auth');



routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var User = require('./../models/user');
var Seen = require('./../models/seen');
var Film = require('./../models/film');
routeur.use(expressValidator());

routeur.get('/signup',ensureNotAuthenticated,(req,res) => {
        var user = new User();
        res.render('user/signup.hbs', {user:user});
});

routeur.post('/signup' ,ensureNotAuthenticated , (req,res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const mail = req.body.mail ;
    const password = req.body.password ;
    const password2 = req.body.password2 ;
    const birthday = req.body.birthday ;

    req.checkBody('firstname','Un prénom est obligatoire').notEmpty();
    req.checkBody('lastname','Un nom est obligatoire').notEmpty();
    req.checkBody('username','Un pseudo est obligatoire').notEmpty();
    req.checkBody('mail','Un mail est obligatoire').notEmpty();
    req.checkBody('birthday','Une date de naissance est obligatoire').notEmpty();
    req.checkBody('mail','L\'adresse mail n\'est pas valide').isEmail();
    req.checkBody('password','Un mot de passe est obligatoire').notEmpty();
    req.checkBody('password2','Les mot de passe ne correspondent pas').equals(password);

    let errors = req.validationErrors();
    if(errors){
        res.render('user/signup.hbs' , {errors:errors});
    }
    else {
        let user = new User({
            firstname:firstname,
            lastname:lastname,
            username:username,
            mail:mail,
            birthday:birthday,
            password:password,
            isAdmin:false,
        })
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(user.password , salt , (err,hash) => {
                if(err) {
                    console.log(err);
                }
                else {
                    user.password = hash ;
                    user.save( (err) => {
                        if(err) {
                            console.log(err);
                            return
                        }
                        else {
                            res.redirect('/');
                        }
                    })
                }
            });
        })
    }
})

routeur.get('/profile' , ensureAuthenticated , (req,res) => {
    Seen.find({idUser:req.user.id}).then(seen => {
        var time = 0;
        for (i in seen) {
            Film.find({_id : seen[i].idFilm}).then( film => {

                time = time + film[0].duration;
                
            });
            console.log(time);
        };
        console.log(time);
        res.render('user/profile.hbs' , {time : time});
    })
})


routeur.get('/login' , ensureNotAuthenticated, (req,res) => {
    res.render('user/login.hbs');
})

routeur.post('/login', ensureNotAuthenticated, (req,res,next) => {
    passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/user/login',
        failureFlash: true,
    }) (req, res, next) ;
})

routeur.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Vous etes bien deconectes');
    res.redirect('/');
})


module.exports = routeur;
