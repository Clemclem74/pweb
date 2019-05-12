var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    review : String ,
    grade : Number,
    idFilm : {
            type : mongoose.Schema.Types.ObjectId,
            ref:'Film'
    } ,
    idUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
});


var Review = mongoose.model('Review',reviewSchema,'Review');
module.exports = Review;
