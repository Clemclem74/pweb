var mongoose = require('mongoose');

var seenSchema = new mongoose.Schema({
    idFilm : {
            type : mongoose.Schema.Types.ObjectId,
            ref:'Film'
    } ,
    idUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
});


var Seen = mongoose.model('Seen',seenSchema,'Seen');
module.exports = Seen;
