var express = require('express');
var routeur = express.Router();

var TypeFilm = require('./../models/TypeFilm');
var Film = require('./../models/Film');
routeur.get('/:typefilm', (req,res) => {
    TypeFilm.findOne({name : req.params.typefilm}).populate('Film').then(typefilms => {
    if(!typefilms) return res.status(404).send(req.params.typefilm);
        console.log(typefilms.Film);
        console.log(req.params.typefilm);
        res.render('typefilm/filmByType.hbs', {typefilm:req.params.typefilm , film:typefilms.Film})
    });
});

module.exports = routeur;