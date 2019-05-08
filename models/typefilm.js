var mongoose = require('mongoose');

var typefilmSchema = new mongoose.Schema({
    name : String
});

typefilmSchema.virtual('Film',{
    ref: 'Film',
    localField:'_id',
    foreignField:'typeFilm'
});

var TypeFilm = mongoose.model('TypeFilm',typefilmSchema,'TypeFilm');
module.exports = TypeFilm;
