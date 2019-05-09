var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    } ,
    lastname : {
        type : String,
        required : true
    } ,
    username : {
        type : String,
        required : true
    } ,
    mail : {
        type : String,
        required : true
    } ,
    password : {
        type : String,
        required : true
    } ,
    birthday : {
        type : Date,
        required : true
    }    
},
{versionKey: false}
);

var Film = mongoose.model('User',userSchema,'User');
module.exports = Film;