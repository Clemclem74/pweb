var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var multer = require('multer')
var bodyParser = require('body-parser');
var passport = require('passport')
const { ensureAuthenticated } = require('../config/auth');
const { ensureNotAuthenticated } = require('../config/auth');



routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var User = require('./../models/user');
var Seen = require('./../models/seen');
routeur.use(expressValidator());

routeur.get('/signup', ensureNotAuthenticated, (req, res) => {
    var user = new User();
    res.render('user/signup.hbs', { user: user });
});

routeur.post('/signup', ensureNotAuthenticated, (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const mail = req.body.mail;
    const password = req.body.password;
    const password2 = req.body.password2;
    const birthday = req.body.birthday;

    req.checkBody('firstname', 'Un prénom est obligatoire </br><hr>').notEmpty();
    req.checkBody('lastname', 'Un nom est obligatoire </br><hr>').notEmpty();
    req.checkBody('username', 'Un pseudo est obligatoire </br><hr>').notEmpty();
    req.checkBody('mail', 'Un mail est obligatoire </br><hr>').notEmpty();
    req.checkBody('birthday', 'Une date de naissance est obligatoire </br><hr>').notEmpty();
    req.checkBody('mail', 'L\'adresse mail n\'est pas valide </br><hr>').isEmail();
    req.checkBody('password', 'Un mot de passe est obligatoire </br><hr>').notEmpty();
    req.checkBody('password2', 'Les mot de passe ne correspondent pas </br><hr>').equals(password);

    var errors = req.validationErrors();

    User.findOne({ username: username }).then(usernamefind => {
        if (usernamefind) {
            req.flash('failure', 'Pseudo déjà utilisé <br><hr>')
            res.redirect('/');
            return
        }
        User.findOne({ mail: mail }).then(mailfind => {
            if (mailfind) {
                req.flash('failure', 'Adresse mail déjà prise <br><hr>')
                res.redirect('/');
                return
            }
            if (errors) {
                errors.forEach(error => {
                    //console.log(error.msg);
                    req.flash('failure', error.msg)
                });

                res.redirect('/');
                return
            }
            else {
                let user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    mail: mail,
                    birthday: birthday,
                    password: password,
                    isAdmin: false,
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                            req.flash('failure', 'Erreur lors du hashage veuillez recommencer')
                            res.redirect('/');
                            return

                        }
                        else {
                            user.password = hash;
                            user.save((err) => {
                                if (err) {
                                    console.log(err);
                                    req.flash('failure', 'Erreur lors de l\'enregistrement veuillez recommencer')
                                    res.redirect('/');
                                    return
                                }
                                else {
                                    console.log("Compte créé");
                                    req.flash('success', 'Votre compte a été créé');
                                    res.redirect('/');
                                    return
                                }
                            })
                        }
                    });
                })
            }
        })

    })


})

routeur.get('/profile', ensureAuthenticated, (req, res) => {
    Seen.find({ idUser: req.user.id }).populate('idFilm').then(seen => {
        var time = 0;
        for (i in seen) {
            time = time + seen[i].idFilm.duration;
        };
        res.render('user/profile.hbs', { time: time });
    })
})


routeur.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('user/login.hbs');
})

routeur.post('/login', ensureNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            req.flash('failure', err);
            res.redirect('/');
            return next(err);
        }
        if (!user) {
            req.flash('failure', 'Mauvais pseudo ou Mot de passe');
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Vous êtes bien connecté');
            return res.redirect('/');
        });
    })(req, res, next);
})

routeur.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Vous êtes bien déconnecté');
    res.redirect('/');
})


module.exports = routeur;
