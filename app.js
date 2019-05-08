var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var multer = require('multer');

var storage = multer.diskStorage({ // initializing multer diskStorage to be able to keep the file original name and extension
    destination: function (req, file, cb)
    {
        cb(null, __dirname + '/uploads');
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname);
    }
});
    
    
var uploads = multer({ storage: storage });

require('./models/Film');
require('./models/TypeFilm');
require('./models/User');

var url = 'mongodb://localhost/pweb';

mongoose.connect(url, { useNewUrlParser: true });

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


app.use('/', require('./roots/film'));
app.use('/typefilm', require('./roots/typefilm'));
app.use('/user', require('./roots/user'));
app.use(uploads.single('picture'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


