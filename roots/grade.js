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
var Grade = require('./../models/Grade');
routeur.use(expressValidator());

routeur.get('/post_grade/:id',(req,res) => {
        var grade = new Grade();
        res.render('grade/post_grade.html', {grade:grade , filmid:req.params.id});
});

routeur.post('/post_grade/:id' , upload.none() , (req,res) => {
    if(!req.user) {
        res.render('user/signin.html');
    }
    const grade = req.body.grade;
    const idUser = req.user._id;
    const idFilm = req.params.id;


    req.checkBody('grade','Un avis est obligatoire').notEmpty();

    let errors = req.validationErrors();
    if(errors){
        res.render('grade/post_grade.html' , {errors:errors});
    }
    else {
        let global_grade = new Grade({
            grade:grade,
            idUser:idUser,
            idFilm:idFilm,
        })
        
        global_grade.save( (err) => {
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
