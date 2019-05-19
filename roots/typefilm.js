var express = require('express');
var routeur = express.Router();
const { ensureAdmin } = require('../config/admin');
var bodyParser = require('body-parser');
routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());

var TypeFilm = require('./../models/typefilm');
var See = require('./../models/seen');




routeur.get('/newtypefilm', ensureAdmin, (req,res) => {
    var typefilm = new TypeFilm();
    res.render('typefilm/newTypeFilm.hbs', {typefilm:typefilm});
});


routeur.post('/newtypefilm' , ensureAdmin , (req,res) => {
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


routeur.get('/:typefilm/:page?', async function(req,res) {
    var query = req.query.query || [];
    var perPage = 6;
    var page = req.params.page || 1;
    if(req.user) {
        const typefilm = await TypeFilm.find({name : req.params.typefilm}).populate('Film').sort('-releaseYear')
        count = typefilm[0].Film.length
        var data = [];
        var tmp = (perPage * page)-perPage
        for (i = tmp; i < tmp+perPage; i++) {
            if(typefilm[0].Film[i]){
                const see = await See.find({idFilm : typefilm[0].Film[i]._id, idUser:req.user._id })
                if (see.length) {
                    seen= '<img style="opacity: 0.7; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                    //seen='<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>'
                }
                else {
                    seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                }
                data.push({seen:seen , film : typefilm[0].Film[i]});
            }
            
        }
            res.render('typefilm/filmByType.hbs', {data: data , typefilm:req.params.typefilm , current: page , pages: Math.ceil(count / perPage)});
    }
    else {
        const typefilm = await TypeFilm.find({name : req.params.typefilm}).populate('Film').sort('-releaseYear')
        count = typefilm[0].Film.length
        var data = [];
        var tmp = (perPage * page)-perPage
        for (i = tmp; i < tmp+perPage; i++) {
            if(typefilm[0].Film[i]){
                
            seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                
            data.push({seen:seen , film : typefilm[0].Film[i]});
            
            }
        }
            res.render('typefilm/filmByType.hbs', {data: data , typefilm:req.params.typefilm , current: page , pages: Math.ceil(count / perPage)});
    }








});







module.exports = routeur;