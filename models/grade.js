var mongoose = require('mongoose');

var gradeSchema = new mongoose.Schema({
    grade : Number ,
    idFilm : {
            type : mongoose.Schema.Types.ObjectId,
            ref:'Film'
    } ,
    idUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
});


var Grade = mongoose.model('Grade',gradeSchema,'Grade');
module.exports = Grade;
