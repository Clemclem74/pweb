var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var config = require('./config/database');
var passport = require('passport');
var cookieSession = require('cookie-session');
var keys = require('./config/keys');
var flash=require("connect-flash");
var request = require('ajax-request');
var hbs = require('express-handlebars');
var path = require('path');



require('./models/Film');
var TypeFilm = require('./models/TypeFilm');
require('./models/User');
require('./models/Review');



mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', success =>
{ // if connection to DB succeed
    console.log("connecté à la base de données MongoDB");
});

var app = express();

//Variables :
TypeFilm.find({}).then(alltypes => {
  app.locals.alltypes=alltypes;
})


app.listen(8070);
console.log("Application bien lancée sur le port 8070");

/* nunjucks.configure('views',{
    autoescape:true,
    express:app
}); */




//Déclaration of Handlebar
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./config/handlebars')
  }))

  
  app.set('view engine', '.hbs')

  


app.use(flash());
require('./config/passport')(passport);
app.use(cookieSession({
    maxAge: 6*60*60*1000,
    keys: [keys.cookieSession.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) =>{
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next()
})




app.use('/', require('./roots/film'));
app.use('/typefilm', require('./roots/typefilm'));
app.use('/user', require('./roots/user'));
app.use('/review', require('./roots/review'));
app.use('/recommend', require('./roots/recommend'));
app.use('/seen', require('./roots/seen'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/ico', express.static(__dirname + '/node_modules/bootstrap/dist/ico'));
app.use('/layouts', express.static(__dirname + '/layouts'));



