var mongoose = require('mongoose');

var filmSchema = new mongoose.Schema({
    title : String,
    description : String,
    duration : Number,
    releaseYear : Number,
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
});


filmSchema.virtual('Review',{
    ref: 'Review',
    localField:'_id',
    foreignField:'idFilm'
});

filmSchema.virtual('Grade',{
    ref: 'Grade',
    localField:'_id',
    foreignField:'idFilm'
});

filmSchema.virtual('Recommend',{
    ref: 'Recommend',
    localField:'_id',
    foreignField:'idFilm'
});


var Film = mongoose.model('Film',filmSchema,'Film');
module.exports = Film;