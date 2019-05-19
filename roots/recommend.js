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
var See = require('./../models/seen');
var Review = require('./../models/review');

routeur.use(expressValidator());

routeur.get('/list/:page?', ensureAuthenticated, async function(req,res){
    var page = req.params.page || [1];
    if (page.length < 5) {
        var perPage = 6;
        var page = req.params.page || 1;

        film = await Recommend.find({idUserTo : req.user._id}).populate('idFilm').populate('idUserFrom').skip((perPage * page)-perPage).limit(perPage)
        count = await Recommend.find({idUserTo : req.user._id}).countDocuments();

        var data = [];
        for (i in film) {
            const see = await See.find({idFilm : film[i].idFilm._id, idUser:req.user._id })
            if (see.length) {
                seen= '<img style="opacity: 0.7; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
                //seen='<h1><span id="already-seen" class="badge badge-pill badge-success">Déjà vu</span></h1>'
            }
            else {
                seen= '<img style="opacity: 0; filter: alpha(opacity=50)" width=100% height=100% src="/uploads/vu.png">'
            }
            data.push({seen:seen , film : film[i]});
        }
            
            res.render('recommend/list_film.hbs', {data: data , current: page , pages: Math.ceil(count / perPage)});
        
    }
    else {
        res.redirect('/')
    }
        
});

routeur.get('/:id',(req,res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
        var recommend = new Recommend();
        User.find({}).then( Allusers => {
            Film.findById(req.params.id).then(film => {
                res.render('recommend/recommend.hbs', {recommend:recommend , film:film , Allusers : Allusers});
            })
        })
    }
    else {
        res.redirect('/')
    }      
});


routeur.post('/:idFilm' , (req,res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.idFilm)){
        if(!req.user) {
            res.render('user/signin.hbs');
        }
    
        const nameUserTo = req.body.nameUserTo;
        const idUserFrom = req.user._id;
        const idFilm = req.params.idFilm;
    
    
        req.checkBody('nameUserTo','Un autre utilisateur est obligatoire').notEmpty();
        let errors = req.validationErrors();
        
    
        if(errors){
            res.render('recommend/recommend.hbs' , {errors:errors});
        }
        else {
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
                        Film.findById(req.params.idFilm).populate('typeFilm').then(film => {
                            Review.find({idFilm : req.params.id}).populate('idUser').then( list_review => {
                                See.find({idUser : req.user._id , idFilm : req.params.idFIlm}).then(see => {
                                    var moyenne=0;
                                    list_review.forEach((item, index, array) => {
                                        moyenne = moyenne + item.grade;
                                    })
                                    moyenne=moyenne/list_review.length;
                                    data={film:film, list_review:list_review , user:req.user , grade : parseInt(moyenne) , see : see};
                                    res.render('film/details.hbs' , data);
                                })
                                
                            })
                        }) 
                    }
                })
            })
            
        }
    }
})






module.exports = routeur;
