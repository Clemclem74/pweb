var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var multer  = require('multer')
var upload = multer({ dest: '/uploads/' })
var bodyParser = require('body-parser');


routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var User = require('./../models/User');
routeur.use(expressValidator());

routeur.get('/signup',(req,res) => {
        var user = new User();
        res.render('user/signup.html', {user:user});
});

routeur.post('/signup' , upload.none() , (req,res) => {
    console.log(req);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const pseudo = req.body.pseudo;
    const mail = req.body.mail ;
    const password = req.body.password ;
    const password2 = req.body.password2 ;
    const birthday = req.body.birthday ;

    req.checkBody('firstname','Un prénom est obligatoire').notEmpty();
    req.checkBody('lastname','Un nom est obligatoire').notEmpty();
    req.checkBody('pseudo','Un pseudo est obligatoire').notEmpty();
    req.checkBody('mail','Un mail est obligatoire').notEmpty();
    req.checkBody('birthday','Une date de naissance est obligatoire').notEmpty();
    req.checkBody('mail','L\'adresse mail n\'est pas valide').isEmail();
    req.checkBody('password','Un mot de passe est obligatoire').notEmpty();
    req.checkBody('password2','Les mot de passe ne correspondent pas').equals(password);

    let errors = req.validationErrors();
    if(errors){
        res.render('user/signup.html' , {errors:errors});
    }
    else {
        let user = new User({
            firstname:firstname,
            lastname:lastname,
            pseudo:pseudo,
            mail:mail,
            birthday:birthday,
            password:password,
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


routeur.get('/login' , (req,res) => {
    res.render('user/login.html');
})



module.exports = routeur;
