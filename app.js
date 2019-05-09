var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var multer = require('multer');
var config = require('./config/database');
var passport = require('passport');
var cookieSession = require('cookie-session');
var keys = require('./config/keys');
var flash=require("connect-flash");


require('./models/Film');
require('./models/TypeFilm');
require('./models/User');



mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', success =>
{ // if connection to DB succeed
    console.log("connecté à la base de données MongoDB");
});

var app = express();

app.listen(8070);
console.log("Application bien lancée sur le port 8070");

nunjucks.configure('views',{
    autoescape:true,
    express:app
});

app.use(flash());
require('./config/passport')(passport);
app.use(cookieSession({
    maxAge: 6*60*60*1000,
    keys: [keys.cookieSession.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', require('./roots/film'));
app.use('/typefilm', require('./roots/typefilm'));
app.use('/user', require('./roots/user'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


