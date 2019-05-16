var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var config = require('./config/database');
var passport = require('passport');
var cookieSession = require('cookie-session');
var keys = require('./config/keys');
var flash=require("connect-flash");
var hbs = require('express-handlebars');
var path = require('path');





const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost/pweb';

mongoose.connect(CONNECTION_URI, { useNewUrlParser: true });

mongoose.connection.on('connected', success =>
{ // if connection to DB succeed
    console.log("connecté à la base de données MongoDB");
});
mongoose.set('useFindAndModify', false);

var app = express();

const PORT = process.env.PORT || 8050;


require('./models/film');
var TypeFilm = require('./models/typefilm');
require('./models/user');
require('./models/review');


//Variables :
TypeFilm.find({}).then(alltypes => {
  app.locals.alltypes=alltypes;
})


app.listen(PORT);
console.log("Application bien lancée sur le port " + PORT);






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
    app.locals.failure = req.flash('failure')
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
app.use('/css', express.static(__dirname + '/template/css'));
app.use('/js', express.static(__dirname + '/template/js'));
app.use('/ico', express.static(__dirname + '/template/ico'));
app.use('/layouts', express.static(__dirname + '/layouts'));



