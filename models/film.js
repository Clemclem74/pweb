var mongoose = require('mongoose');

var filmSchema = new mongoose.Schema({
    title : String,
    description : String,
    picture : String,
    trailer: String,
    downlink: String,
    streamlink: String,
    typeFilm : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'TypeFilm'
        }
    ]
},
{versionKey: false}
);

var Film = mongoose.model('Film',filmSchema,'Film');
module.exports = Film;