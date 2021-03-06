var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var Film = require('./../models/film');
var Seen = require('./../models/seen');
var Review = require('./../models/review');
routeur.use(expressValidator());
const methodOverride = require('method-override');
routeur.use(methodOverride('_method'));


routeur.get('/:id', (req, res) => {
    var seen = new Seen();
    res.render('review/post_review.hbs', { seen: seen, filmid: req.params.id });
});

routeur.delete('/:id', (req, res) => {
    Seen.findOneAndRemove({ idFilm: req.params.id, idUser: req.user._id }).then(() => {
        Film.findById(req.params.id).populate('typeFilm').then(film => {
            Review.find({ idFilm: req.params.id }).populate('idUser').then(list_review => {
                Seen.find({ idUser: req.user._id, idFilm: req.params.id }).then(see => {
                    var moyenne = 0;
                    list_review.forEach((item, index, array) => {
                        moyenne = moyenne + item.grade;
                    })
                    moyenne = moyenne / list_review.length;
                    data = { film: film, list_review: list_review, user: req.user, grade: parseInt(moyenne), see: see };
                    res.render('film/details.hbs', data);
                })

            })
        })
    })
});


routeur.post('/:id', (req, res) => {
    if (!req.user) {
        res.render('user/signin.hbs');
    }
    const idUser = req.user._id;
    const idFilm = req.params.id;

    let seen = new Seen({
        idUser: idUser,
        idFilm: idFilm,
    })

    seen.save((err) => {
        if (err) {
            console.log(err);
            return
        }
        else {
            Film.findById(req.params.id).populate('typeFilm').then(film => {
                Review.find({ idFilm: req.params.id }).populate('idUser').then(list_review => {
                    Seen.find({ idUser: req.user._id, idFilm: req.params.id }).then(see => {
                        var moyenne = 0;
                        list_review.forEach((item, index, array) => {
                            moyenne = moyenne + item.grade;
                        })
                        moyenne = moyenne / list_review.length;
                        data = { film: film, list_review: list_review, user: req.user, grade: parseInt(moyenne), see: see };
                        res.render('film/details.hbs', data);
                    })

                })
            })
        }
    })
})






module.exports = routeur;
