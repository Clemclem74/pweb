var express = require('express');
var routeur = express.Router();
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var multer  = require('multer')
var bodyParser = require('body-parser');
var User = require('./../models/user');
const { ensureAdmin } = require('../config/admin');
const { ensureAuthenticated } = require('../config/auth');


routeur.use(bodyParser.urlencoded({
    extended: true
}));
routeur.use(bodyParser.json());
var Review = require('./../models/review');
var See = require('./../models/seen');
var Film = require('./../models/film');
routeur.use(expressValidator());

const methodOverride = require('method-override');
routeur.use(methodOverride('_method'));


routeur.get('/post_review/:id',(req,res) => {
        var review = new Review();
        res.render('review/post_review.hbs', {review:review , filmid:req.params.id});
});





routeur.get('/edit/:id' , (req,res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)  && !req.query.query){
        Review.findById(req.params.id).populate('idUser').then(review => {
            res.render('review/edit_review.hbs', {review:review});
        })
    }
})

routeur.delete('/:id', ensureAdmin , (req,res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)  && !req.query.query){
        Review.find({_id : req.params.id}).then(idfilm => {
            idFilm=idfilm[0].idFilm;
            Review.findOneAndRemove({ _id : req.params.id}).then(() => {
                Film.find({_id : idFilm}).populate('typeFilm').then(film => {
                    Review.find({idFilm : idFilm}).populate('idUser').then( list_review => {
                        See.find({idUser : req.user._id , idFilm : idFilm}).then(see => {
                            var moyenne=0;
                            list_review.forEach((item, index, array) => {
                                moyenne = moyenne + item.grade;
                            })
                            moyenne=moyenne/list_review.length;
                            data={film:film[0], list_review:list_review , user:req.user , grade : parseInt(moyenne) , see : see[0]};
                            res.render('film/details.hbs' , data);
                        })
                        
                    })
                })
            })
        })
    }
    else {
        res.redirect('/')
    }
})


routeur.post('/post_review/:id', ensureAuthenticated , (req,res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)  && !req.query.query){
        if(!req.user) {
            res.render('user/signin.hbs');
        }
        const review = req.body.review;
        const grade = req.body.grade;
        const idUser = req.user._id;
        const idFilm = req.params.id;
    
    
        req.checkBody('review','Un avis est obligatoire').notEmpty();
    
        let errors = req.validationErrors();
        if(errors){
            res.render('review/post_review.hbs' , {errors:errors});
        }
        else {
            let global_review = new Review({
                review:review,
                grade : grade,
                idUser:idUser,
                idFilm:idFilm,
            })
            
            global_review.save( (err) => {
                if(err) {
                    console.log(err);
                    return
                }
                else {
                    Film.findById(req.params.id).populate('typeFilm').then(film => {
                        Review.find({idFilm : req.params.id}).populate('idUser').then( list_review => {
                            See.find({idUser : req.user._id , idFilm : req.params.id}).then(see => {
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
        }
    
    }
    else {
        res.redirect('/');
    }
    
})





routeur.post('/edit/:id', ensureAuthenticated , async function(req,res)  {
    if (mongoose.Types.ObjectId.isValid(req.params.id)  && !req.query.query){
        if(!req.user) {
            res.render('user/signin.hbs');
        }
        review = await Review.findById(req.params.id);
        if((review.idUser < req.user._id) || review.idUser> req.user._id) {
            console.log('different user')
            res.redirect('/');
        }
        else {
            req.checkBody('review','Un avis est obligatoire').notEmpty();
            req.checkBody('grade','Un avis est obligatoire').notEmpty();
            
            let errors = req.validationErrors();
            if(errors){
                console.log(errors)
                res.render('review/edit_review.hbs' , {errors:errors , review:review});
            }
            else {
                review.grade = req.body.grade
                review.review=req.body.review
    
                
                
                review.save( (err) => {
                    if(err) {
                        console.log(err);
                        return
                    }
                    else {
                        console.log("commentaie modifié");

                        Film.findById(review.idFilm).populate('typeFilm').then(film => {
                            Review.find({idFilm : review.idFilm}).populate('idUser').then( list_review => {
                                See.find({idUser : req.user._id , idFilm : review.idFilm}).then(see => {
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
            }
        }
    
       
    }
    else {
        res.redirect('/')
    }
})


module.exports = routeur;
