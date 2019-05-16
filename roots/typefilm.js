var express = require('express');
var routeur = express.Router();
const { ensureAdmin } = require('../config/admin');
var bodyParser = require('body-parser');
routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());

var TypeFilm = require('./../models/typefilm');




routeur.get('/newtypefilm', ensureAdmin, (req,res) => {
    console.log("get");
    var typefilm = new TypeFilm();
    res.render('typefilm/newTypeFilm.hbs', {typefilm:typefilm});
});


routeur.post('/newtypefilm' , ensureAdmin , (req,res) => {
    console.log(req.body);
    const name = req.body.name;
    req.checkBody('name','Un nom est obligatoire').notEmpty();
    req.message = req.validationErrors();
    if(req.message){
        res.render('typefilm/newTypeFilm.hbs');
    }
    else {
        let typefilm = new TypeFilm({
            name:name,
        })
        typefilm.save( (err) => {
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


routeur.get('/:typefilm', (req,res) => {
    TypeFilm.findOne({name : req.params.typefilm}).populate('Film').sort('-releaseYear').then(typefilms => {
    if(!typefilms) return res.status(404).send(req.params.typefilm);
        console.log(typefilms.Film);
        console.log(req.params.typefilm);
        res.render('typefilm/filmByType.hbs', {typefilm:req.params.typefilm , film:typefilms.Film})
    });
});







module.exports = routeur;