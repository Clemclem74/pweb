var express = require('express');
var routeur = express.Router();

var TypeFilm = require('./../models/TypeFilm');

routeur.get('/:typefilm', (req,res) => {
    TypeFilm.findOne({name : req.params.typefilm}).populate('Film').then(typefilm => {
    if(!typefilm) return res.status(404).send('Type introuvable');

        res.render('typefilm/filmByType.html', {typefilm:typefilm , film:typefilm.Film})
    });
});

module.exports = routeur;